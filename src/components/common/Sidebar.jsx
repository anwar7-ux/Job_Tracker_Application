import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import './Sidebar.css'

const NAV = [
  { to: '/dashboard',      icon: '⬛', label: 'Dashboard' },
  { to: '/jobs',           icon: '⬛', label: 'My Jobs' },
  { to: '/analytics',      icon: '⬛', label: 'Analytics' },
  { to: '/notifications',  icon: '⬛', label: 'Notifications' },
  { to: '/profile',        icon: '⬛', label: 'Profile' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [header, setHeader] = useState(null)

  useEffect(() => {
    axiosApi.get('/site/header').then(r => setHeader(r.data[0])).catch(() => {})
  }, [])

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        {header?.logoUrl
          ? <img src={header.logoUrl} alt="logo" className="sb-logo" />
          : <div className="sb-logo-placeholder">JT</div>}
        <span className="sb-name">{header?.websiteName || 'Job Tracker'}</span>
      </div>

      <nav className="sb-nav">
        {NAV.map(n => (
          <Link
            key={n.to}
            to={n.to}
            className={`sb-link${location.pathname === n.to ? ' sb-active' : ''}`}
          >
            <span className="sb-icon">{getSVG(n.label)}</span>
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="sb-bottom">
        <div className="sb-user">
          <div className="sb-avatar">{(localStorage.getItem('username') || 'U')[0].toUpperCase()}</div>
          <div>
            <div className="sb-username">{localStorage.getItem('username') || 'User'}</div>
            <div className="sb-role">USER</div>
          </div>
        </div>
        <button className="sb-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>
  )
}

function getSVG(label) {
  const icons = {
    'Dashboard': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    'My Jobs': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    'Analytics': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    'Notifications': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    'Profile': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  }
  return icons[label] || null
}
