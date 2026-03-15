import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'


// Protected routes
import { ProtectedUserRoute, ProtectedAdminRoute, ProtectedHRRoute } from './components/ProtectedRoutes'

// Layouts
import { UserLayout, AdminLayout, HRLayout } from './components/common/Layouts'
import './components/common/Layouts.css'

// User pages
import Dashboard from './pages/user/Dashboard'
import KanbanPage from './pages/user/KanbanPage'
import AnalyticsPage from './pages/user/AnalyticsPage'
import NotificationsPage from './pages/user/NotificationsPage'
import ProfilePage from './pages/user/ProfilePage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSiteHeader from './pages/admin/AdminSiteHeader'
import AdminSiteFooter from './pages/admin/AdminSiteFooter'
import AdminNavigation from './pages/admin/AdminNavigation'
import AdminFooterNavigation from './pages/admin/AdminFooterNavigation'

// HR pages
import HRDashboard from './pages/hr/HRDashboard'
import HRRegisterAdmin from './pages/hr/HRRegisterAdmin'

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER routes */}
        <Route element={<ProtectedUserRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/jobs"          element={<KanbanPage />} />
            <Route path="/analytics"     element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile"       element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ADMIN routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                    element={<AdminDashboard />} />
            <Route path="/admin/users"              element={<AdminUsers />} />
            <Route path="/admin/site-header"        element={<AdminSiteHeader />} />
            <Route path="/admin/site-footer"        element={<AdminSiteFooter />} />
            <Route path="/admin/navigation"         element={<AdminNavigation />} />
            <Route path="/admin/footer-navigation"  element={<AdminFooterNavigation />} />
          </Route>
        </Route>

        {/* HR routes */}
        <Route element={<ProtectedHRRoute />}>
          <Route element={<HRLayout />}>
            <Route path="/hr"                  element={<HRDashboard />} />
            <Route path="/hr/register-admin"   element={<HRRegisterAdmin />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App