import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

// ---------------------------------------------------------------------------
// SQLite-backed document store.
//
// Each "collection" is a table of (id, doc) where `doc` is the JSON object.
// Writes happen one row at a time inside a transaction, so two requests that
// change different rows (e.g. two sign-ups) can't clobber each other the way
// a full-file JSON rewrite did.
//
// The public API (read / write / findById / findOne / insert / update / delete)
// is unchanged, so the models did not need to change.
//
// The .db file is generated and git-ignored; the JSON files in this folder are
// the committed seed data, loaded into an empty table on first run.
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.resolve(__dirname, '../data')
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'reticen8.db')

// Collections and which field is their primary key.
const COLLECTIONS = {
  users: 'id',
  courses: 'id',
  certifications: 'id',
  credentials: 'credentialId',
  statistics: 'id',
  resetTokens: 'token',
}

class SqliteDB {
  constructor() {
    this.db = new DatabaseSync(DB_PATH)
    this.db.exec('PRAGMA journal_mode = WAL;')
    this.db.exec('PRAGMA foreign_keys = ON;')
    for (const collection of Object.keys(COLLECTIONS)) {
      this.db.exec(`CREATE TABLE IF NOT EXISTS "${collection}" (id TEXT PRIMARY KEY, doc TEXT NOT NULL)`)
      this.#seedIfEmpty(collection)
    }
  }

  idKey(collection) {
    return COLLECTIONS[collection] || 'id'
  }

  // Load the matching .json seed file into an empty table.
  #seedIfEmpty(collection) {
    const count = this.db.prepare(`SELECT COUNT(*) AS n FROM "${collection}"`).get().n
    if (count > 0) return
    const seedPath = path.join(DATA_DIR, `${collection}.json`)
    if (!fs.existsSync(seedPath)) return
    let rows
    try {
      rows = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
    } catch (err) {
      console.error(`[DB] Could not parse seed file ${collection}.json:`, err.message)
      return
    }
    if (!Array.isArray(rows) || rows.length === 0) return
    this.#replaceAll(collection, rows)
    console.log(`[DB] Seeded "${collection}" with ${rows.length} row(s) from ${collection}.json`)
  }

  #replaceAll(collection, rows) {
    const idKey = this.idKey(collection)
    const insert = this.db.prepare(`INSERT OR REPLACE INTO "${collection}" (id, doc) VALUES (?, ?)`)
    this.db.exec('BEGIN')
    try {
      this.db.exec(`DELETE FROM "${collection}"`)
      for (const row of rows) {
        insert.run(String(row[idKey]), JSON.stringify(row))
      }
      this.db.exec('COMMIT')
    } catch (err) {
      this.db.exec('ROLLBACK')
      throw err
    }
  }

  read(collection) {
    if (!COLLECTIONS[collection]) return []
    try {
      return this.db.prepare(`SELECT doc FROM "${collection}"`).all().map((r) => JSON.parse(r.doc))
    } catch (err) {
      console.error(`[DB] Error reading collection "${collection}":`, err.message)
      return []
    }
  }

  // Replace the whole collection (used rarely, e.g. the password migration).
  write(collection, data) {
    if (!COLLECTIONS[collection] || !Array.isArray(data)) return false
    try {
      this.#replaceAll(collection, data)
      return true
    } catch (err) {
      console.error(`[DB] Error writing collection "${collection}":`, err.message)
      return false
    }
  }

  findById(collection, id) {
    if (!COLLECTIONS[collection]) return null
    const row = this.db.prepare(`SELECT doc FROM "${collection}" WHERE id = ?`).get(String(id))
    return row ? JSON.parse(row.doc) : null
  }

  findOne(collection, predicate) {
    return this.read(collection).find(predicate) || null
  }

  insert(collection, item) {
    const idKey = this.idKey(collection)
    this.db
      .prepare(`INSERT INTO "${collection}" (id, doc) VALUES (?, ?)`)
      .run(String(item[idKey]), JSON.stringify(item))
    return item
  }

  update(collection, id, updates) {
    const existing = this.findById(collection, id)
    if (!existing) return null
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() }
    this.db
      .prepare(`UPDATE "${collection}" SET doc = ? WHERE id = ?`)
      .run(JSON.stringify(merged), String(id))
    return merged
  }

  delete(collection, id) {
    const result = this.db.prepare(`DELETE FROM "${collection}" WHERE id = ?`).run(String(id))
    return result.changes > 0
  }
}

export const db = new SqliteDB()
export default db
