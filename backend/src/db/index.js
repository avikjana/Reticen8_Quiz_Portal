import fs from 'node:fs'
import path from 'node:path'
import tls from 'node:tls'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.resolve(__dirname, '../data')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.MONGODB_DB || 'reticen8_academy'

const COLLECTIONS = {
  users: 'id',
  courses: 'id',
  certifications: 'id',
  credentials: 'credentialId',
  statistics: 'id',
  resetTokens: 'token',
  enrollments: 'id',
  feedback: 'id',
  chatMessages: 'id',
}

class MongoDB {
  constructor() {
    this.client = null
    this.db = null
    this._ready = null
  }

  async connect() {
    if (this.db) return this.db
    if (this._ready) return this._ready

    this._ready = (async () => {
      this.client = new MongoClient(MONGODB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: false,
        secureContext: tls.createSecureContext({ securityLevel: 1 }),
      })
      await this.client.connect()
      this.db = this.client.db(DB_NAME)
      console.log(`[DB] Connected to MongoDB: ${DB_NAME}`)

      for (const collection of Object.keys(COLLECTIONS)) {
        const col = this.db.collection(collection)
        await col.createIndex({ _docId: 1 }, { unique: true })
        await this.#seedIfEmpty(collection)
      }

      await this.#syncCurriculum()
      return this.db
    })()

    return this._ready
  }

  idKey(collection) {
    return COLLECTIONS[collection] || 'id'
  }

  async #seedIfEmpty(collection) {
    const col = this.db.collection(collection)
    const count = await col.countDocuments()
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

    const idKey = this.idKey(collection)
    const docs = rows.map(row => ({ ...row, _docId: String(row[idKey]) }))
    await col.insertMany(docs)
    console.log(`[DB] Seeded "${collection}" with ${rows.length} row(s) from ${collection}.json`)
  }

  async #syncCurriculum() {
    const seedPath = path.join(DATA_DIR, 'courses.json')
    if (!fs.existsSync(seedPath)) return
    let rows
    try { rows = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) } catch { return }
    if (!Array.isArray(rows)) return

    const col = this.db.collection('courses')
    for (const course of rows) {
      await col.updateOne(
        { _docId: String(course.id) },
        { $set: { curriculum: course.curriculum, lessonsCount: course.lessonsCount, modulesCount: course.modulesCount } }
      )
    }
    console.log('[DB] Synced course curriculum from courses.json')
  }

  async read(collection) {
    if (!COLLECTIONS[collection]) return []
    try {
      const docs = await this.db.collection(collection).find({}).toArray()
      return docs.map(d => { const { _id, _docId, ...rest } = d; return rest })
    } catch (err) {
      console.error(`[DB] Error reading collection "${collection}":`, err.message)
      return []
    }
  }

  async write(collection, data) {
    if (!COLLECTIONS[collection] || !Array.isArray(data)) return false
    try {
      const col = this.db.collection(collection)
      const idKey = this.idKey(collection)
      await col.deleteMany({})
      if (data.length > 0) {
        const docs = data.map(row => ({ ...row, _docId: String(row[idKey]) }))
        await col.insertMany(docs)
      }
      return true
    } catch (err) {
      console.error(`[DB] Error writing collection "${collection}":`, err.message)
      return false
    }
  }

  async findById(collection, id) {
    if (!COLLECTIONS[collection]) return null
    const doc = await this.db.collection(collection).findOne({ _docId: String(id) })
    if (!doc) return null
    const { _id, _docId, ...rest } = doc
    return rest
  }

  async findOne(collection, predicate) {
    const all = await this.read(collection)
    return all.find(predicate) || null
  }

  async insert(collection, item) {
    const idKey = this.idKey(collection)
    await this.db.collection(collection).insertOne({ ...item, _docId: String(item[idKey]) })
    return item
  }

  async update(collection, id, updates) {
    const existing = await this.findById(collection, id)
    if (!existing) return null
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() }
    await this.db.collection(collection).replaceOne(
      { _docId: String(id) },
      { ...merged, _docId: String(id) }
    )
    return merged
  }

  async delete(collection, id) {
    const result = await this.db.collection(collection).deleteOne({ _docId: String(id) })
    return result.deletedCount > 0
  }
}

export const db = new MongoDB()
export default db
