import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'

export default function Dashboard() {
  const [myApps, setMyApps] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosApi.get('/job-apply/mine'),
      axiosApi.get('/job-posts/mine'),
    ]).then(([appsRes, postsRes]) => {
      setMyApps(appsRes.data)
      setMyPosts(postsRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const counts = {
    total:       myApps.length,
    pending:     myApps.filter(a => a.status === 'PENDING').length,
    resume:      myApps.filter(a => a.status === 'RESUME_REVIEW').length,
    interview:   myApps.filter(a => a.status === 'INTERVIEW').length,
    offered:     myApps.filter(a => a.status === 'OFFERED').length,
    rejected:    myApps.filter(a => a.status === 'REJECTED').length,
    posted:      myPosts.length,
    openPosts:   myPosts.filter(p => p.status === 'OPEN').length,
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="greeting">Welcome, {localStorage.getItem('username')} 👋</span>
      </div>

      <h2 className="section-title" style={{marginBottom:12}}>My Applications</h2>
      <div className="stats-grid" style={{marginBottom:28}}>
        <StatCard label="Total Applied"   value={counts.total}     color="blue"   icon="📋" />
        <StatCard label="Pending"         value={counts.pending}   color="gray"   icon="⏳" />
        <StatCard label="Resume Review"   value={counts.resume}    color="yellow" icon="📄" />
        <StatCard label="Interview"       value={counts.interview} color="purple" icon="🗣️" />
        <StatCard label="Offered"         value={counts.offered}   color="green"  icon="🎉" />
        <StatCard label="Rejected"        value={counts.rejected}  color="red"    icon="❌" />
      </div>

      <h2 className="section-title" style={{marginBottom:12}}>My Job Posts</h2>
      <div className="stats-grid" style={{marginBottom:28, gridTemplateColumns:'repeat(2,1fr)', maxWidth:400}}>
        <StatCard label="Total Posted" value={counts.posted}    color="blue"  icon="📢" />
        <StatCard label="Open Jobs"    value={counts.openPosts} color="green" icon="✅" />
      </div>

      <div className="card">
        <h2 className="section-title" style={{marginBottom:14}}>Recent Applications</h2>
        {loading && <p className="empty-msg">Loading…</p>}
        {!loading && myApps.length === 0 && (
          <p className="empty-msg">No applications yet. Go to <strong>Job Board</strong> to apply!</p>
        )}
        {!loading && myApps.length > 0 && (
          <table className="data-table">
            <thead>
              <tr><th>Job Title</th><th>Company</th><th>Applied Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {myApps.slice(0,5).map(a => (
                <tr key={a.id}>
                  <td><strong>{a.jobTitle}</strong></td>
                  <td>{a.companyName}</td>
                  <td>{a.appliedDate}</td>
                  <td><span className={`badge ${STATUS_BADGE[a.status]||'badge-gray'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const STATUS_BADGE = {
  PENDING:       'badge-gray',
  RESUME_REVIEW: 'badge-yellow',
  INTERVIEW:     'badge-purple',
  OFFERED:       'badge-green',
  REJECTED:      'badge-red',
}

function StatCard({ label, value, color, icon }) {
  const C = {
    blue:   { bg:'#eff6ff', text:'#2563eb', border:'#bfdbfe' },
    yellow: { bg:'#fffbeb', text:'#d97706', border:'#fde68a' },
    green:  { bg:'#f0fdf4', text:'#16a34a', border:'#bbf7d0' },
    purple: { bg:'#f5f3ff', text:'#7c3aed', border:'#ddd6fe' },
    red:    { bg:'#fef2f2', text:'#dc2626', border:'#fecaca' },
    gray:   { bg:'#f8fafc', text:'#64748b', border:'#e2e8f0' },
  }[color] || { bg:'#f8fafc', text:'#64748b', border:'#e2e8f0' }
  return (
    <div className="stat-card" style={{background:C.bg, borderColor:C.border}}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{color:C.text}}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}