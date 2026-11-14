import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Common/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { usePageTitle } from './hooks/usePageTitle'

// Public Pages
import Home from './pages/Home'
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const LearningPlayer = lazy(() => import('./pages/LearningPlayer'))
const Certifications = lazy(() => import('./pages/Certifications'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'))

// Role-Based Portals
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'))
const AdminCourses = lazy(() => import('./pages/Admin/AdminCourses'))
const EmployeeDashboard = lazy(() => import('./pages/Employee/EmployeeDashboard'))
const PartnerDashboard = lazy(() => import('./pages/Partner/PartnerDashboard'))

// Helper component to auto-scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Per-route <title> for the static pages. Detail pages (course, certifications)
// set their own more specific title, so they're intentionally absent here.
const ROUTE_TITLES = {
  '/': null,
  '/courses': 'Course Catalog',
  '/paths': 'Learning Paths',
  '/login': 'Sign In',
  '/signup': 'Create Account',
  '/forgot-password': 'Reset Password',
  '/reset-password': 'Reset Password',
  '/labs': 'Hands-on Labs',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/courses': 'Manage Courses',
  '/employee': 'Employee Dashboard',
  '/partner': 'Partner Portal',
}
const SELF_TITLED = ['/courses/', '/certifications', '/learn/']

function RouteTitle() {
  const { pathname } = useLocation()
  const ownsTitle = SELF_TITLED.some((p) => pathname.startsWith(p))
  usePageTitle(ownsTitle ? false : ROUTE_TITLES[pathname] ?? null)
  return null
}

function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-white" role="status" aria-label="Loading">
      <span className="w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-brand-600 animate-spin" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <RouteTitle />
        <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes (members-only pages are wrapped in ProtectedRoute) */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/paths" element={<Courses />} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/learn/:id" element={<ProtectedRoute><LearningPlayer /></ProtectedRoute>} />
          <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/certifications/:id" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/labs" element={<ProtectedRoute><LearningPlayer /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Administrator Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />

          {/* Employee / Engineer Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Administrator']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Partner Routes */}
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={['Partner', 'Administrator']}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
