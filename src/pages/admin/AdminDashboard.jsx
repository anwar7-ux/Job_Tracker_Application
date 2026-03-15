import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import '../user/User.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axiosApi.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
  }, [])

  const total = users.length
  const active = users.filter(u => u.active).length
  const byRole = { USER: 0, ADMIN: 0, HR: 0 }
  users.forEach(u => { if (byRole[u.role] !== undefined) byRole[u.role]++ })

  // ✅ Changed from localStorage to sessionStorage
  const username = sessionStorage.getItem('username')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <span className="greeting">Welcome, {username} 👋</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div className="stat-icon">👥</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{total}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{active}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
          <div className="stat-icon">🛡️</div>
          <div className="stat-value" style={{ color: '#7c3aed' }}>{byRole.ADMIN}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card" style={{ background: '#f0fdf4', borderColor: '#6ee7b7' }}>
          <div className="stat-icon">👔</div>
          <div className="stat-value" style={{ color: '#059669' }}>{byRole.HR}</div>
          <div className="stat-label">HR Staff</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>Recent Users</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 8).map(u => (
              <tr key={u.id}>
                <td><strong>{u.username}</strong></td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-blue' : u.role === 'HR' ? 'badge-green' : 'badge-gray'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}