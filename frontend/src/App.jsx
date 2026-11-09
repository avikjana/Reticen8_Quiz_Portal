import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Common/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import LearningPlayer from './pages/LearningPlayer'
import Certifications from './pages/Certifications'
import Login from './pages/Login'
import ForgotPassword from './components/Auth/ForgotPassword'

// Role-Based Portals
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminCourses from './pages/Admin/AdminCourses'
import EmployeeDashboard from './pages/Employee/EmployeeDashboard'
import PartnerDashboard from './pages/Partner/PartnerDashboard'

// Helper component to auto-scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
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
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
