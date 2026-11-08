# Reticen8 Academy — Premium Cybersecurity Training Platform

Professional enterprise firewall and cybersecurity training platform with dedicated **Frontend** and **Backend** architecture.

---

## 📁 Project Architecture

```
Reticen8_Quiz_Portal/
├── frontend/                     # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Hero, Cards, etc.)
│   │   ├── pages/                # Dedicated pages (Home, Courses, CourseDetail, LearningPlayer, Certifications)
│   │   ├── data/                 # Course catalog, certifications, and statistics
│   │   ├── App.jsx               # Router & page navigation
│   │   └── index.css             # Tailwind v4 theme & typography styling
│   ├── public/                   # Static icons & assets
│   ├── package.json              # Frontend dependencies (React, Framer Motion, Lucide)
│   └── vite.config.js            # Vite configuration
│
├── backend/                      # Node.js REST API Server
│   ├── server.js                 # HTTP REST API server with CORS
│   ├── data/                     # JSON storage for courses, credentials, stats
│   │   ├── courses.json
│   │   ├── certifications.json
│   │   ├── statistics.json
│   │   └── credentials.json
│   └── package.json              # Backend configuration
│
└── package.json                  # Root workspace runner scripts
```

---

## 🚀 Running the Project

### 1. Start the Frontend (Vite)
From the root directory:
```bash
npm run dev:frontend
```
*Or navigate inside `frontend/`:*
```bash
cd frontend
npm run dev
```
Open **http://localhost:5173** in your browser.

---

### 2. Start the Backend API Server
From the root directory:
```bash
npm run dev:backend
```
*Or navigate inside `backend/`:*
```bash
cd backend
node server.js
```
The REST API runs at **http://localhost:5000**.

#### Available REST API Endpoints:
- `GET  /api/health` — Health check
- `GET  /api/statistics` — Training KPIs & metrics
- `GET  /api/courses` — Course catalog (supports `?search=`, `?category=`, `?difficulty=`)
- `GET  /api/courses/:id` — Single course curriculum
- `GET  /api/certifications` — Official certification ladders & blueprints
- `POST /api/verify` — Candidate credential verification
- `POST /api/terminal/exec` — Interactive sandbox CLI simulator
