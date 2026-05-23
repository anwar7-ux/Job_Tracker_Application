import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedUserRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token || role !== 'USER') return <Navigate to="/login" replace />
  return <Outlet />
}

export function ProtectedAdminRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token || role !== 'ADMIN') return <Navigate to="/login" replace />
  return <Outlet />
}

export function ProtectedHRRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token || role !== 'HR') return <Navigate to="/login" replace />
  return <Outlet />
}