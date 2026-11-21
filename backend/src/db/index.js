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
        maxPoolSize: 20,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      })
      await this.client.connect()
      this.db = this.client.db(DB_NAME)
      console.log(`[DB] Connected to MongoDB: ${DB_NAME}`)

      for (const collection of Object.keys(COLLECTIONS)) {
        const col = this.db.collection(collection)
        await col.createIndex({ _docId: 1 }, { unique: true })
        await this.#seedIfEmpty(collection)
      }

      await this.#createIndexes()
      await this.#syncCurriculum()
      return this.db
    })()

    return this._ready
  }

  async #createIndexes() {
    const idx = async (col, spec, opts) => {
      try { await this.db.collection(col).createIndex(spec, opts || {}) } catch {}
    }

    // Users: lookup by email (case-insensitive queries use regex, but index helps), googleId
    await idx('users', { email: 1 })
    await idx('users', { googleId: 1 }, { sparse: true })
    await idx('users', { role: 1 })

    // Enrollments: the two most common query patterns
    await idx('enrollments', { userId: 1, status: 1 })
    await idx('enrollments', { courseId: 1, status: 1 })
    await idx('enrollments', { userId: 1, courseId: 1 })

    // Chat: messages by course, by user, compound for thread queries
    await idx('chatMessages', { courseId: 1, createdAt: 1 })
    await idx('chatMessages', { courseId: 1, userId: 1, createdAt: 1 })
    await idx('chatMessages', { courseId: 1, targetUserId: 1, createdAt: 1 }, { sparse: true })

    // Quiz attempts
    await idx('quizAttempts', { userId: 1, courseId: 1, moduleIndex: 1 }, { unique: true })
    await idx('quizAttempts', { passed: 1, attemptsUsed: 1 })

    // Feedback
    await idx('feedback', { userId: 1, courseId: 1 })

    // Reset tokens
    await idx('resetTokens', { userId: 1 })
    await idx('resetTokens', { expiresAt: 1 }, { expireAfterSeconds: 0 })

    // Certifications / credentials
    await idx('certifications', { code: 1 })
    await idx('credentials', { credentialId: 1 })

    console.log('[DB] Indexes ensured')
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
    const ops = rows.map(course => ({
      updateOne: {
        filter: { _docId: String(course.id) },
        update: { $set: { curriculum: course.curriculum, lessonsCount: course.lessonsCount, modulesCount: course.modulesCount } }
      }
    }))
    if (ops.length) await col.bulkWrite(ops)
    console.log('[DB] Synced course curriculum from courses.json')
  }

  #strip(doc) {
    if (!doc) return null
    const { _id, _docId, ...rest } = doc
    return rest
  }

  // --- Read operations ---

  async read(collection) {
    if (!COLLECTIONS[collection]) return []
    try {
      const docs = await this.db.collection(collection).find({}).toArray()
      return docs.map(d => this.#strip(d))
    } catch (err) {
      console.error(`[DB] Error reading collection "${collection}":`, err.message)
      return []
    }
  }

  async findById(collection, id) {
    if (!COLLECTIONS[collection]) return null
    const doc = await this.db.collection(collection).findOne({ _docId: String(id) })
    return this.#strip(doc)
  }

  async findOne(collection, predicate) {
    if (typeof predicate === 'object' && predicate !== null && typeof predicate !== 'function') {
      const doc = await this.db.collection(collection).findOne(predicate)
      return this.#strip(doc)
    }
    // Legacy: JS predicate fallback — full scan
    const all = await this.read(collection)
    return all.find(predicate) || null
  }

  async findMany(collection, query, options = {}) {
    const col = this.db.collection(collection)
    let cursor = col.find(query)
    if (options.sort) cursor = cursor.sort(options.sort)
    if (options.limit) cursor = cursor.limit(options.limit)
    if (options.projection) cursor = cursor.project(options.projection)
    const docs = await cursor.toArray()
    return docs.map(d => this.#strip(d))
  }

  async countDocs(collection, query = {}) {
    return await this.db.collection(collection).countDocuments(query)
  }

  // --- Write operations ---

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

  async insert(collection, item) {
    const idKey = this.idKey(collection)
    await this.db.collection(collection).insertOne({ ...item, _docId: String(item[idKey]) })
    return item
  }

  async update(collection, id, updates) {
    const col = this.db.collection(collection)
    const result = await col.findOneAndUpdate(
      { _docId: String(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )
    return this.#strip(result)
  }

  async delete(collection, id) {
    const result = await this.db.collection(collection).deleteOne({ _docId: String(id) })
    return result.deletedCount > 0
  }
}

export const db = new MongoDB()
export default db
