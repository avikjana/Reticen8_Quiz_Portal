import CourseModel from '../models/course.model.js'

export class CustomerController {
  static async getDashboard(req, res) {
    const user = req.user
    const courses = await CourseModel.getVisibleTo(req.user.role)

    return {
      success: true,
      data: {
        customer: user,
        enrolledCourses: courses.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          difficulty: c.difficulty,
          status: 'Enrolled (Course Design Pending)',
        })),
        certificationsEarned: [
          {
            code: 'RCFA',
            title: 'Reticen8 Certified Firewall Associate',
            status: 'Active',
            issuedDate: '2025-10-15',
          },
        ],
        learningStats: {
          assignedTracks: 2,
          competenciesAssessed: 5,
        },
      },
    }
  }

  static async getEnrollments(req, res) {
    const courses = await CourseModel.getVisibleTo(req.user.role)
    return {
      success: true,
      enrollments: courses.slice(0, 2),
    }
  }
}

export default CustomerController
