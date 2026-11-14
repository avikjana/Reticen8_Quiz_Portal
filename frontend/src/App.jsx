import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Common/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const LearningPlayer = lazy(() => import('./pages/LearningPlayer'))
const Certifications = lazy(() => import('./pages/Certifications'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'))

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

function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-white" role="status" aria-label="Loading">
      <span className="w-10 h-10 rounded-full border-[3px] border-emerald-100 border-t-[#16A34A] animate-spin" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/paths" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn/:id" element={<LearningPlayer />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/certifications/:id" element={<Certifications />} />
          <Route path="/labs" element={<LearningPlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
