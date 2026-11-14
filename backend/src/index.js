import createApp from './app.js'
import UserModel from './models/user.model.js'

await UserModel.migratePlaintextPasswords()

const PORT = process.env.PORT || 5000

const app = createApp()

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🚀 Reticen8 Academy Enterprise Backend API Server Running       ║
║   🔗 Local: http://localhost:${PORT}                                ║
╠═══════════════════════════════════════════════════════════════════╣
║   🛡️ Auth Routes:                                                 ║
║      - POST /api/auth/login    (Admin, Employee, Partner)         ║
║      - POST /api/auth/register (New User Registration)            ║
║      - POST /api/auth/google   (Sign in with Google)              ║
║      - GET  /api/auth/me       (Active Session Inspection)        ║
║      - POST /api/auth/logout   (Session Invalidation)             ║
║      - GET  /api/auth/roles    (Role Capabilities)                ║
║   👔 Role Routes:                                                 ║
║      - GET  /api/admin/overview                                   ║
║      - GET  /api/admin/users                                      ║
║      - GET  /api/employee/dashboard                               ║
║      - GET  /api/partner/dashboard                                ║
║      - GET  /api/courses                                          ║
╚═══════════════════════════════════════════════════════════════════╝
`)
})

export default app
