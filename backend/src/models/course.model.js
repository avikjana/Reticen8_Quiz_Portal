import db from '../db/index.js'

export class CourseModel {
  static getAll() {
    return db.read('courses')
  }

  static findById(id) {
    return db.findById('courses', id)
  }

  // Which roles may see a course is set per course by its `audience` list in
  // courses.json (e.g. ["Employee", "Partner"]). Administrators see everything,
  // and a course with no `audience` is open to every role.
  static isVisibleTo(course, role) {
    if (role === 'Administrator') return true
    if (!Array.isArray(course.audience) || course.audience.length === 0) return true
    return course.audience.includes(role)
  }

  // Courses for a signed-in role. Signed-out visitors (no role) see the whole
  // public catalog.
  static getVisibleTo(role) {
    const all = db.read('courses')
    return role ? all.filter((c) => CourseModel.isVisibleTo(c, role)) : all
  }

  static create(courseData) {
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
      badge: '🛡️',
      skills: courseData.skills || [],
      curriculum: [], // Awaiting user course design
      createdAt: new Date().toISOString(),
    }
    return db.insert('courses', newCourse)
  }

  static update(id, updates) {
    return db.update('courses', id, updates)
  }

  static delete(id) {
    return db.delete('courses', id)
  }
}

export default CourseModel
