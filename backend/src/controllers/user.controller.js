import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'

export class UserController {
  static async getProfile(req, res) {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }
    return {
      success: true,
      profile: req.user,
    }
  }

  static async updateProfile(req, res) {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }
    const { name, department, roleTitle } = req.body || {}
    const updated = UserModel.update(req.user.id, { name, department, roleTitle })
    return {
      success: true,
      profile: UserModel.sanitize(updated),
    }
  }
}

export default UserController
