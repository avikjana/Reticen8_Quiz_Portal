import crypto from 'node:crypto'
import db from '../db/index.js'

const STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
}

export class EnrollmentModel {
  static async enroll(userId, courseId) {
    const existing = await EnrollmentModel.findByUserAndCourse(userId, courseId)
    if (existing && existing.status !== STATUS.DROPPED) return null

    if (existing && existing.status === STATUS.DROPPED) {
      return await db.update('enrollments', existing.id, {
        status: STATUS.ACTIVE,
        enrolledAt: new Date().toISOString(),
      })
    }

    const now = new Date().toISOString()
    const enrollment = {
      id: `enr-${crypto.randomUUID()}`,
      userId,
      courseId,
      status: STATUS.ACTIVE,
      enrolledAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    return await db.insert('enrollments', enrollment)
  }

  static async getByUser(userId, { includeDropped = false } = {}) {
    const all = await db.read('enrollments')
    return all.filter(
      (e) =>
        e.userId === userId &&
        (includeDropped || e.status !== STATUS.DROPPED)
    )
  }

  static async getByCourse(courseId) {
    const all = await db.read('enrollments')
    return all.filter((e) => e.courseId === courseId && e.status !== STATUS.DROPPED)
  }

  static async findByUserAndCourse(userId, courseId) {
    return await db.findOne(
      'enrollments',
      (e) => e.userId === userId && e.courseId === courseId
    )
  }

  static async unenroll(userId, courseId) {
    const enrollment = await EnrollmentModel.findByUserAndCourse(userId, courseId)
    if (!enrollment || enrollment.status === STATUS.DROPPED) return false
    await db.update('enrollments', enrollment.id, { status: STATUS.DROPPED })
    return true
  }

  static async countByCourse(courseId) {
    const enrollments = await EnrollmentModel.getByCourse(courseId)
    return enrollments.length
  }

  static async isEnrolled(userId, courseId) {
    const e = await EnrollmentModel.findByUserAndCourse(userId, courseId)
    return e != null && e.status !== STATUS.DROPPED
  }

  static async getAll() {
    return await db.read('enrollments')
  }
}

export default EnrollmentModel
