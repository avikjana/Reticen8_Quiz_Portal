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
  certificates: 'id',
}

// Collections whose data rarely changes — cache for longer
const LONG_CACHE_MS = 60_000
const SHORT_CACHE_MS = 5_000
const CACHE_TTL = {
  courses: LONG_CACHE_MS,
  certifications: LONG_CACHE_MS,
  credentials: LONG_CACHE_MS,
  statistics: LONG_CACHE_MS,
  users: SHORT_CACHE_MS,
  enrollments: SHORT_CACHE_MS,
  feedback: SHORT_CACHE_MS,
  chatMessages: 2_000,
  quizAttempts: SHORT_CACHE_MS,
  certificates: SHORT_CACHE_MS,
  resetTokens: 0,
}

class MemCache {
  constructor() { this._store = new Map() }

  get(key, ttl) {
    const entry = this._store.get(key)
    if (!entry) return undefined
    if (Date.now() - entry.ts > ttl) { this._store.delete(key); return undefined }
    return entry.val
  }

  set(key, val) { this._store.set(key, { val, ts: Date.now() }) }

  invalidate(prefix) {
    for (const k of this._store.keys()) {
      if (k.startsWith(prefix)) this._store.delete(k)
    }
  }

  clear() { this._store.clear() }
}

class MongoDB {
  constructor() {
    this.client = null
    this.db = null
    this._ready = null
    this._cache = new MemCache()
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
        minPoolSize: 5,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 15000,
        compressors: ['zstd', 'snappy', 'zlib'],
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

      // Warm cache with static data
      await this.read('courses')
      await this.read('certifications')
      await this.read('credentials')

      return this.db
    })()

    return this._ready
  }

  async #createIndexes() {
    const idx = async (col, spec, opts) => {
      try { await this.db.collection(col).createIndex(spec, opts || {}) } catch {}
    }

    await idx('users', { email: 1 })
    await idx('users', { googleId: 1 }, { sparse: true })
    await idx('users', { role: 1 })

    await idx('enrollments', { userId: 1, status: 1 })
    await idx('enrollments', { courseId: 1, status: 1 })
    await idx('enrollments', { userId: 1, courseId: 1 })

    await idx('chatMessages', { courseId: 1, createdAt: 1 })
    await idx('chatMessages', { courseId: 1, userId: 1, createdAt: 1 })
    await idx('chatMessages', { courseId: 1, targetUserId: 1, createdAt: 1 }, { sparse: true })

    await idx('quizAttempts', { userId: 1, courseId: 1, moduleIndex: 1 }, { unique: true })
    await idx('quizAttempts', { passed: 1, attemptsUsed: 1 })

    await idx('feedback', { userId: 1, courseId: 1 })

    await idx('resetTokens', { userId: 1 })
    await idx('resetTokens', { expiresAt: 1 }, { expireAfterSeconds: 0 })

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
    this._cache.invalidate('courses:')
    console.log('[DB] Synced course curriculum from courses.json')
  }

  #strip(doc) {
    if (!doc) return null
    const { _id, _docId, ...rest } = doc
    return rest
  }

  #ttl(collection) {
    return CACHE_TTL[collection] ?? SHORT_CACHE_MS
  }

  // --- Read operations (cached) ---

  async read(collection) {
    if (!COLLECTIONS[collection]) return []
    const cacheKey = `${collection}:all`
    const ttl = this.#ttl(collection)
    if (ttl > 0) {
      const cached = this._cache.get(cacheKey, ttl)
      if (cached) return cached
    }
    try {
      const docs = await this.db.collection(collection).find({}).toArray()
      const result = docs.map(d => this.#strip(d))
      if (ttl > 0) this._cache.set(cacheKey, result)
      return result
    } catch (err) {
      console.error(`[DB] Error reading collection "${collection}":`, err.message)
      return []
    }
  }

  async findById(collection, id, projection) {
    if (!COLLECTIONS[collection]) return null
    const cacheKey = `${collection}:id:${id}${projection ? ':p:' + Object.keys(projection).sort().join(',') : ''}`
    const ttl = this.#ttl(collection)
    if (ttl > 0) {
      const cached = this._cache.get(cacheKey, ttl)
      if (cached !== undefined) return cached
    }
    const opts = projection ? { projection } : undefined
    const doc = await this.db.collection(collection).findOne({ _docId: String(id) }, opts)
    const result = this.#strip(doc)
    if (ttl > 0) this._cache.set(cacheKey, result)
    return result
  }

  async findOne(collection, predicate, projection) {
    if (typeof predicate === 'object' && predicate !== null && typeof predicate !== 'function') {
      const cacheKey = `${collection}:q:${JSON.stringify(predicate)}${projection ? ':p:' + JSON.stringify(projection) : ''}`
      const ttl = this.#ttl(collection)
      if (ttl > 0) {
        const cached = this._cache.get(cacheKey, ttl)
        if (cached !== undefined) return cached
      }
      const opts = projection ? { projection } : undefined
      const doc = await this.db.collection(collection).findOne(predicate, opts)
      const result = this.#strip(doc)
      if (ttl > 0) this._cache.set(cacheKey, result)
      return result
    }
    const all = await this.read(collection)
    return all.find(predicate) || null
  }

  async findMany(collection, query, options = {}) {
    const ttl = this.#ttl(collection)
    if (ttl > 0 && !options.noCache) {
      const cacheKey = `${collection}:fm:${JSON.stringify(query)}:${JSON.stringify(options.sort || '')}:${options.limit || ''}`
      const cached = this._cache.get(cacheKey, ttl)
      if (cached) return cached
      const col = this.db.collection(collection)
      let cursor = col.find(query)
      if (options.sort) cursor = cursor.sort(options.sort)
      if (options.limit) cursor = cursor.limit(options.limit)
      if (options.projection) cursor = cursor.project(options.projection)
      const docs = await cursor.toArray()
      const result = docs.map(d => this.#strip(d))
      this._cache.set(cacheKey, result)
      return result
    }
    const col = this.db.collection(collection)
    let cursor = col.find(query)
    if (options.sort) cursor = cursor.sort(options.sort)
    if (options.limit) cursor = cursor.limit(options.limit)
    if (options.projection) cursor = cursor.project(options.projection)
    const docs = await cursor.toArray()
    return docs.map(d => this.#strip(d))
  }

  async countDocs(collection, query = {}) {
    const cacheKey = `${collection}:cnt:${JSON.stringify(query)}`
    const ttl = this.#ttl(collection)
    if (ttl > 0) {
      const cached = this._cache.get(cacheKey, ttl)
      if (cached !== undefined) return cached
    }
    const count = await this.db.collection(collection).countDocuments(query)
    if (ttl > 0) this._cache.set(cacheKey, count)
    return count
  }

  async cachedAggregate(collection, pipeline, ttl) {
    const cacheKey = `${collection}:agg:${JSON.stringify(pipeline)}`
    const cacheTtl = ttl ?? this.#ttl(collection)
    if (cacheTtl > 0) {
      const cached = this._cache.get(cacheKey, cacheTtl)
      if (cached) return cached
    }
    const result = await this.db.collection(collection).aggregate(pipeline).toArray()
    if (cacheTtl > 0) this._cache.set(cacheKey, result)
    return result
  }

  async aggregateEnrollmentCounts() {
    const cacheKey = 'enrollments:agg:counts'
    const cached = this._cache.get(cacheKey, SHORT_CACHE_MS)
    if (cached) return cached
    const pipeline = [
      { $match: { status: { $ne: 'dropped' } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]
    const results = await this.db.collection('enrollments').aggregate(pipeline).toArray()
    const map = new Map(results.map(r => [r._id, r.count]))
    this._cache.set(cacheKey, map)
    return map
  }

  // --- Write operations (invalidate cache) ---

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
      this._cache.invalidate(`${collection}:`)
      return true
    } catch (err) {
      console.error(`[DB] Error writing collection "${collection}":`, err.message)
      return false
    }
  }

  async insert(collection, item) {
    const idKey = this.idKey(collection)
    await this.db.collection(collection).insertOne({ ...item, _docId: String(item[idKey]) })
    this._cache.invalidate(`${collection}:`)
    return item
  }

  async update(collection, id, updates) {
    const col = this.db.collection(collection)
    const result = await col.findOneAndUpdate(
      { _docId: String(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )
    this._cache.invalidate(`${collection}:`)
    return this.#strip(result)
  }

  async delete(collection, id) {
    const result = await this.db.collection(collection).deleteOne({ _docId: String(id) })
    this._cache.invalidate(`${collection}:`)
    return result.deletedCount > 0
  }
}

export const db = new MongoDB()
export default db
