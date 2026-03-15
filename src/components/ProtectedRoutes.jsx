import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedUserRoute() {
  const token = sessionStorage.getItem('token')
  const role = sessionStorage.getItem('role')
  if (!token || role !== 'USER') return <Navigate to="/login" replace />
  return <Outlet />
}

export function ProtectedAdminRoute() {
  const token = sessionStorage.getItem('token')
  const role = sessionStorage.getItem('role')
  if (!token || role !== 'ADMIN') return <Navigate to="/login" replace />
  return <Outlet />
}

export function ProtectedHRRoute() {
  const token = sessionStorage.getItem('token')
  const role = sessionStorage.getItem('role')
  if (!token || role !== 'HR') return <Navigate to="/login" replace />
  return <Outlet />
}