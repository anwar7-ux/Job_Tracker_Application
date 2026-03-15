import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import './User.css'

const STATUS_COLORS = {
  APPLIED:   'badge-blue',
  INTERVIEW: 'badge-yellow',
  OFFERED:   'badge-green',
  REJECTED:  'badge-red',
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosApi.get('/jobs').then(r => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const counts = {
    total: jobs.length,
    applied: jobs.filter(j => j.applicationStatus === 'APPLIED').length,
    interview: jobs.filter(j => j.applicationStatus === 'INTERVIEW').length,
    offered: jobs.filter(j => j.applicationStatus === 'OFFERED').length,
    rejected: jobs.filter(j => j.applicationStatus === 'REJECTED').length,
  }
  const successRate = counts.total ? Math.round((counts.offered / counts.total) * 100) : 0
  const recent = [...jobs].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="greeting">Welcome back, {localStorage.getItem('username')} 👋</span>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Applications" value={counts.total} color="blue" icon="📋" />
        <StatCard label="In Interview" value={counts.interview} color="yellow" icon="🗣️" />
        <StatCard label="Offers Received" value={counts.offered} color="green" icon="🎉" />
        <StatCard label="Success Rate" value={`${successRate}%`} color="purple" icon="📈" />
      </div>

      <div className="card" style={{marginTop: 24}}>
        <h2 className="section-title">Recent Applications</h2>
        {loading && <p className="empty-msg">Loading…</p>}
        {!loading && recent.length === 0 && <p className="empty-msg">No jobs yet. Go to My Jobs to add your first application!</p>}
        {!loading && recent.length > 0 && (
          <table className="data-table" style={{marginTop: 12}}>
            <thead>
              <tr>
                <th>Job Title</th><th>Company</th><th>Applied Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(j => (
                <tr key={j.id}>
                  <td><strong>{j.jobTitle}</strong></td>
                  <td>{j.companyName}</td>
                  <td>{j.appliedDate}</td>
                  <td><span className={`badge ${STATUS_COLORS[j.applicationStatus] || 'badge-gray'}`}>{j.applicationStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    yellow: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    green: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    purple: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  }
  const c = colors[color]
  return (
    <div className="stat-card" style={{ background: c.bg, borderColor: c.border }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color: c.text }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
