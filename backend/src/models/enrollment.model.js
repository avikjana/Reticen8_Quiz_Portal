import crypto from 'node:crypto'
import db from '../db/index.js'

// Enrollment statuses
const STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
}

export class EnrollmentModel {
  /**
   * Enroll a user in a course. Returns the new enrollment or null if already enrolled.
   */
  static enroll(userId, courseId) {
    const existing = EnrollmentModel.findByUserAndCourse(userId, courseId)
    if (existing && existing.status !== STATUS.DROPPED) return null // already enrolled

    // Re-enroll if previously dropped
    if (existing && existing.status === STATUS.DROPPED) {
      return db.update('enrollments', existing.id, {
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
    return db.insert('enrollments', enrollment)
  }

  /**
   * Get all enrollments for a user (active + completed by default).
   */
  static getByUser(userId, { includeDropped = false } = {}) {
    return db
      .read('enrollments')
      .filter(
        (e) =>
          e.userId === userId &&
          (includeDropped || e.status !== STATUS.DROPPED)
      )
  }

  /**
   * Get all enrollments for a course.
   */
  static getByCourse(courseId) {
    return db.read('enrollments').filter((e) => e.courseId === courseId && e.status !== STATUS.DROPPED)
  }

  /**
   * Find a specific user+course enrollment.
   */
  static findByUserAndCourse(userId, courseId) {
    return db.findOne(
      'enrollments',
      (e) => e.userId === userId && e.courseId === courseId
    )
  }

  /**
   * Unenroll (soft-delete — marks as dropped).
   */
  static unenroll(userId, courseId) {
    const enrollment = EnrollmentModel.findByUserAndCourse(userId, courseId)
    if (!enrollment || enrollment.status === STATUS.DROPPED) return false
    db.update('enrollments', enrollment.id, { status: STATUS.DROPPED })
    return true
  }

  /**
   * Count active enrollments for a course.
   */
  static countByCourse(courseId) {
    return EnrollmentModel.getByCourse(courseId).length
  }

  /**
   * Check if a user is enrolled in a course.
   */
  static isEnrolled(userId, courseId) {
    const e = EnrollmentModel.findByUserAndCourse(userId, courseId)
    return e != null && e.status !== STATUS.DROPPED
  }

  /**
   * Get all enrollments (admin).
   */
  static getAll() {
    return db.read('enrollments')
  }
}

export default EnrollmentModel
