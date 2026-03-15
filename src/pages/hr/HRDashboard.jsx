import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import '../user/User.css'

export default function HRDashboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // ✅ Using HR endpoint instead of admin endpoint
    axiosApi.get('/hr/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const admins = users.filter(u => u.role === 'ADMIN')
  const activeAdmins = admins.filter(a => a.active)
  const totalUsers = users.filter(u => u.role === 'USER')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">HR Dashboard</h1>
        {/* ✅ sessionStorage instead of localStorage */}
        <span className="greeting">Welcome, {sessionStorage.getItem('username')} 👋</span>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 720 }}>
        <div className="stat-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="stat-icon">🛡️</div>
          <div className="stat-value" style={{ color: '#059669' }}>{admins.length}</div>
          <div className="stat-label">Total Admins</div>
        </div>
        <div className="stat-card" style={{ background: '#f0fdf4', borderColor: '#6ee7b7' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: '#047857' }}>{activeAdmins.length}</div>
          <div className="stat-label">Active Admins</div>
        </div>
        <div className="stat-card" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div className="stat-icon">👥</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{totalUsers.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>All Accounts</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
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
        {users.length === 0 && (
          <p style={{ padding: '20px 0', color: 'var(--gray-400)', fontSize: 14 }}>
            No users found.
          </p>
        )}
      </div>
    </div>
  )
}