import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const primaryDataDir = path.resolve(__dirname, '../data')
const fallbackDataDir = path.resolve(__dirname, '../../data')
const DATA_DIR = fs.existsSync(primaryDataDir) ? primaryDataDir : fallbackDataDir

class JsonDB {
  constructor() {
    this.cache = new Map()
  }

  getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`)
  }

  read(collection) {
    try {
      const filePath = this.getFilePath(collection)
      if (!fs.existsSync(filePath)) {
        return []
      }
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      console.error(`[DB] Error reading collection "${collection}":`, err.message)
      return []
    }
  }

  write(collection, data) {
    try {
      const filePath = this.getFilePath(collection)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
      return true
    } catch (err) {
      console.error(`[DB] Error writing to collection "${collection}":`, err.message)
      return false
    }
  }

  findById(collection, id) {
    const items = this.read(collection)
    return items.find((item) => item.id === id) || null
  }

  findOne(collection, predicate) {
    const items = this.read(collection)
    return items.find(predicate) || null
  }

  insert(collection, item) {
    const items = this.read(collection)
    items.push(item)
    this.write(collection, items)
    return item
  }

  update(collection, id, updates) {
    const items = this.read(collection)
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
    this.write(collection, items)
    return items[index]
  }

  delete(collection, id) {
    const items = this.read(collection)
    const filtered = items.filter((item) => item.id !== id)
    if (filtered.length === items.length) return false
    this.write(collection, filtered)
    return true
  }
}

export const db = new JsonDB()
export default db
