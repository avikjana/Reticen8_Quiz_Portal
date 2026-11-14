import db from '../db/index.js'

// Fields that make up the members-only "certification guide"
const GUIDE_ONLY_FIELDS = ['examBlueprint', 'skills', 'careerPaths']

export class CertificationModel {
  static getAll() {
    return db.read('certifications')
  }

  static findById(id) {
    const key = String(id).toLowerCase()
    return db.findOne('certifications', (c) => c.id === key || c.code.toLowerCase() === key)
  }

  // Public overview shown on the home page (no exam blueprint etc.)
  static toSummary(cert) {
    return Object.fromEntries(Object.entries(cert).filter(([k]) => !GUIDE_ONLY_FIELDS.includes(k)))
  }

  static findCredential(credentialId) {
    const key = String(credentialId).trim().toUpperCase()
    return db.findOne('credentials', (c) => c.credentialId.toUpperCase() === key)
  }
}

export default CertificationModel
