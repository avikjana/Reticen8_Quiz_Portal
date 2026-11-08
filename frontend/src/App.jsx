import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import LearningPlayer from './pages/LearningPlayer'
import Certifications from './pages/Certifications'
import Login from './pages/Login'

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
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/paths" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn/:id" element={<LearningPlayer />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/certifications/:id" element={<Certifications />} />
          <Route path="/labs" element={<LearningPlayer />} />
          <Route path="/login" element={<Login />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
