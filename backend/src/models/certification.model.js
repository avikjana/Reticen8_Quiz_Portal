import db from '../db/index.js'

const GUIDE_ONLY_FIELDS = ['examBlueprint', 'skills', 'careerPaths']

export class CertificationModel {
  static async getAll() {
    return await db.read('certifications')
  }

  static async findById(id) {
    const key = String(id).toLowerCase()
    return await db.findOne('certifications', (c) => c.id === key || c.code.toLowerCase() === key)
  }

  static toSummary(cert) {
    return Object.fromEntries(Object.entries(cert).filter(([k]) => !GUIDE_ONLY_FIELDS.includes(k)))
  }

  static async findCredential(credentialId) {
    const key = String(credentialId).trim().toUpperCase()
    return await db.findOne('credentials', (c) => c.credentialId.toUpperCase() === key)
  }
}

export default CertificationModel
