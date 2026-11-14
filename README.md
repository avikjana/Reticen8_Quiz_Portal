# Reticen8 Academy

Cybersecurity training and firewall certification platform: a **React + Vite** frontend and a **Node.js REST API** backend.

- Setup instructions: [SETUP.md](SETUP.md)
- Node.js 22.9 or newer is required.

## How it fits together

| Part | Where | What it does |
| :--- | :--- | :--- |
| Frontend | `frontend/` | The website. Holds no course or certification content of its own — it loads everything from the API. |
| Backend | `backend/` | REST API on port 5000. Owns all data (`backend/src/data/*.json`), login, and access rules. |

Visitors can browse the home page and course catalog. Opening a course, the labs, or the certification guide requires an account.

## Project structure

```
backend/src/
  index.js            starts the server (hashes any plain-text passwords on boot)
  app.js              HTTP server, CORS, request routing
  routes/             URL -> controller mapping (auth, admin, courses, certifications, ...)
  controllers/        request handlers
  models/             data access (users, courses, certifications)
  middlewares/        authenticate, requireRole, error handler
  utils/              password hashing, JWT, Google sign-in, rate limiting
  db/                 JSON file storage
  data/               users, courses, certifications, credentials, statistics

frontend/src/
  App.jsx             routes (members-only pages wrapped in ProtectedRoute)
  config/roles.js     the three account types: labels, colours, dashboard paths
  context/            AuthContext (session, login, register, Google sign-in)
  hooks/              useApi (data fetching), useDismissable (dropdowns)
  services/           api client, auth API calls
  components/
    ui/               Logo, loading / error / not-found states
    navbar/           ExploreMenu, UserMenu, MobileDrawer
    Auth/             AuthLayout, GoogleSignInButton, ForgotPassword
    Common/           ProtectedRoute
    *.jsx             home page sections, cards, Navbar, Footer
  pages/              Home, Courses, CourseDetail, Certifications, Login, SignUp, dashboards
```

## API

| Endpoint | Access | Purpose |
| :--- | :--- | :--- |
| `POST /api/auth/register` | public | Create an Employee or Partner account |
| `POST /api/auth/login` | public | Email + password sign-in |
| `POST /api/auth/google` | public | Sign in with a Google ID token |
| `GET /api/auth/me`, `POST /api/auth/logout` | signed in | Current user / sign out |
| `GET /api/courses` | public | Course catalog (no curriculum) |
| `GET /api/courses/:id` | signed in | Full course |
| `GET /api/certifications` | public | Certification overview |
| `GET /api/certifications/guide` | signed in | Full certification guide |
| `GET /api/credentials/:id` | public, rate limited | Verify a credential ID |
| `GET /api/statistics` | public | Home page numbers |
| `/api/admin/*` | Administrator | Overview, user management |
| `/api/employee/*`, `/api/partner/*` | matching role (or admin) | Dashboards (sample data for now) |

## Accounts

Three roles: **Administrator**, **Employee**, **Partner**. Anyone can sign up as Employee or Partner; administrators are created by an existing administrator.

Seed accounts for local development (the login form pre-fills these in dev builds only — they are stripped from production builds). **Change or remove them before deploying.**

| Role | Email | Password |
| :--- | :--- | :--- |
| Administrator | `admin@reticen8.com` | `AdminPassword123!` |
| Employee | `employee@reticen8.com` | `EmployeePassword123!` |
| Partner | `partner@reticen8.com` | `PartnerPassword123!` |

## Not built yet

- Course lessons, labs and quizzes (the learning pages are placeholders)
- Password reset emails (the Forgot Password form does not send anything)
- Real enrollment and partner seat data (Employee and Partner dashboards return sample data)
- A real database (data is stored in JSON files; fine for one server, not for concurrent writes at scale)
- Automated tests
