import UserModel from '../models/user.model.js'
import AppError from '../utils/AppError.js'
import { invalidateAuthCache } from '../middlewares/auth.middleware.js'

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
    const updated = await UserModel.update(req.user.id, { name, department, roleTitle })
    invalidateAuthCache(req.user.id)
    return {
      success: true,
      profile: UserModel.sanitize(updated),
    }
  }
}

export default UserController
