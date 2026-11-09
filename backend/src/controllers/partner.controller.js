import CourseModel from '../models/course.model.js'

export class PartnerController {
  static async getDashboard(req, res) {
    const user = req.user
    const courses = CourseModel.getAll()

    return {
      success: true,
      data: {
        partnerOrganization: {
          name: 'Apex Cyber Solutions Ltd.',
          tier: 'Gold Tier Certified Partner',
          partnerId: 'PTR-8821',
          contactEmail: user?.email || 'partner@reticen8.com',
          totalSeatsPurchased: 50,
          activeSeatsAllocated: 32,
          availableSeats: 18,
        },
        sponsoredCourses: courses.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
        })),
        trainees: [
          { id: 'tr-1', name: 'Liam Vance', email: 'liam@apexcyber.com', track: 'NGFW Professional', progress: 'In Progress' },
          { id: 'tr-2', name: 'Elena Rostova', email: 'elena@apexcyber.com', track: 'Security Architect', progress: 'Certified' },
        ],
      },
    }
  }

  static async getTrainees(req, res) {
    return {
      success: true,
      trainees: [
        { id: 'tr-1', name: 'Liam Vance', email: 'liam@apexcyber.com', track: 'NGFW Professional', progress: 'In Progress' },
        { id: 'tr-2', name: 'Elena Rostova', email: 'elena@apexcyber.com', track: 'Security Architect', progress: 'Certified' },
      ],
    }
  }
}

export default PartnerController
