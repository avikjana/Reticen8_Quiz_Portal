import db from '../db/index.js'

export class CourseModel {
  static async getAll() {
    return await db.read('courses')
  }

  static async findById(id) {
    return await db.findById('courses', id)
  }

  static isVisibleTo(course, role) {
    if (role === 'Administrator') return true
    if (!Array.isArray(course.audience) || course.audience.length === 0) return true
    return course.audience.includes(role)
  }

  static async getVisibleTo(role) {
    const all = await db.read('courses')
    return role ? all.filter((c) => CourseModel.isVisibleTo(c, role)) : all
  }

  static async create(courseData) {
    const newCourse = {
      id: courseData.id || `course-${Date.now().toString(36)}`,
      title: courseData.title,
      shortDesc: courseData.shortDesc || '',
      description: courseData.description || '',
      difficulty: courseData.difficulty || 'Beginner',
      difficultyColor: courseData.difficultyColor || 'green',
      category: courseData.category || 'Network Security',
      duration: courseData.duration || 'TBD',
      estimatedWeeks: courseData.estimatedWeeks || 'Self-paced',
      modulesCount: 0,
      lessonsCount: 0,
      rating: 5.0,
      studentsCount: 0,
      certificationCode: courseData.certificationCode || 'RCFA',
      certificationTitle: courseData.certificationTitle || '',
      badge: '\u{1F6E1}️',
      skills: courseData.skills || [],
      curriculum: [],
      createdAt: new Date().toISOString(),
    }
    return await db.insert('courses', newCourse)
  }

  static async update(id, updates) {
    return await db.update('courses', id, updates)
  }

  static async delete(id) {
    return await db.delete('courses', id)
  }
}

export default CourseModel
