# Reticen8 Academy — Fullstack Enterprise Cybersecurity Training Platform

Reticen8 Academy is an enterprise training and firewall certification platform built with a dedicated **React + Vite** frontend and a modular **Node.js REST API** backend.

---

## 🏗️ Architecture Overview

The codebase is organized into a clean enterprise fullstack structure:

```
Reticen8_Quiz_Portal/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── partner.controller.js
│   │   │   └── user.controller.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/
│   │   │   ├── course.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── partner.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/
│   │   │   └── AppError.js
│   │   ├── app.js
│   │   └── index.js
│   ├── data/
│   │   ├── users.json
│   │   ├── courses.json
│   │   ├── certifications.json
│   │   └── statistics.json
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── SignUp.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Common/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminUsers.jsx
│   │   │   │   └── AdminCourses.jsx
│   │   │   ├── Employee/
│   │   │   │   └── EmployeeDashboard.jsx
│   │   │   ├── Partner/
│   │   │   │   └── PartnerDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetail.jsx (Cleaned: ready for user course design)
│   │   │   ├── LearningPlayer.jsx
│   │   │   └── Certifications.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── package.json (root scripts)
```

---

## 🚀 Running the Application

### 1. Start the Backend API (Port 5000)
```bash
npm run dev:backend
```
API endpoints available at `http://localhost:5000/api`:
- `POST /api/auth/login` (Administrator, Employee, Partner)
- `POST /api/auth/register`
- `GET  /api/auth/me`
- `GET  /api/admin/overview`
- `GET  /api/employee/dashboard`
- `GET  /api/partner/dashboard`
- `GET  /api/courses`

### 2. Start the Frontend (Port 5173)
```bash
npm run dev:frontend
```
Open `http://localhost:5173/` in your browser.

---

## 🔐 3 Role Categories & Demo Accounts

| Role Category | Badge | Demo Email | Demo Password | Default Route |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | 🛡️ Purple | `admin@reticen8.com` | `AdminPassword123!` | `/admin` |
| **Employee** | 💼 Emerald | `employee@reticen8.com` | `EmployeePassword123!` | `/employee` |
| **Partner** | 🤝 Blue | `partner@reticen8.com` | `PartnerPassword123!` | `/partner` |

---

## 📌 Course Design Status
All dummy lab materials, fake module curriculums, and placeholder lessons have been stripped from the codebase. The course detail view (`/courses/:id`) and the admin course workspace (`/admin/courses`) are completely clean and ready to receive your official course design, syllabus, and lab structure.
