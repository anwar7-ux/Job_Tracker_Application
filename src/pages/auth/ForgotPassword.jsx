import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import {
  ProtectedUserRoute,
  ProtectedAdminRoute,
  ProtectedHRRoute
} from './components/ProtectedRoutes'

import {
  UserLayout,
  AdminLayout,
  HRLayout
} from './components/common/Layouts'

// User pages
import Dashboard from './pages/user/Dashboard'
import JobBoard from './pages/user/JobBoard'
import PostJob from './pages/user/PostJob'
import MyPosts from './pages/user/MyPostJobs'
import MyApplications from './pages/user/MyApplications'
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
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* USER */}
      <Route element={<ProtectedUserRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job-board" element={<JobBoard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/site-header" element={<AdminSiteHeader />} />
          <Route path="/admin/site-footer" element={<AdminSiteFooter />} />
          <Route path="/admin/navigation" element={<AdminNavigation />} />
          <Route path="/admin/footer-navigation" element={<AdminFooterNavigation />} />
        </Route>
      </Route>

      {/* HR */}
      <Route element={<ProtectedHRRoute />}>
        <Route element={<HRLayout />}>
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/hr/register-admin" element={<HRRegisterAdmin />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

export default App