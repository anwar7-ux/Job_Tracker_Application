import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import './Sidebar.css'

const USER_NAV = [
  { to:'/dashboard',       label:'Dashboard' },
  { to:'/job-board',       label:'Job Board' },
  { to:'/post-job',        label:'Post a Job' },
  { to:'/my-posts',        label:'My Posts' },
  { to:'/my-applications', label:'My Applications' },
  { to:'/notifications',   label:'Notifications' },
  { to:'/profile',         label:'Profile' },
]

const ADMIN_NAV = [
  { to:'/admin',                    label:'Dashboard' },
  { to:'/admin/users',              label:'Users' },
  { to:'/admin/site-header',        label:'Site Header' },
  { to:'/admin/site-footer',        label:'Site Footer' },
  { to:'/admin/navigation',         label:'Navigation' },
  { to:'/admin/footer-navigation',  label:'Footer Nav' },
]

const HR_NAV = [
  { to:'/hr',                  label:'Dashboard' },
  { to:'/hr/register-admin',   label:'Register Admin' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [header, setHeader] = useState(null)
  useEffect(() => { axiosApi.get('/site/header').then(r => setHeader(r.data[0])).catch(() => {}) }, [])
  return (
    <aside className="sidebar sb-user-theme">
      <div className="sb-brand">
        {header?.logoUrl
          ? <img src={header.logoUrl} alt="logo" className="sb-logo" />
          : <div className="sb-logo-fallback" style={{background:'var(--brand)'}}>JT</div>}
        <span className="sb-name">{header?.websiteName || 'Job Tracker'}</span>
      </div>
      <nav className="sb-nav">
        {USER_NAV.map(n => (
          <Link key={n.to} to={n.to} className={`sb-link${location.pathname===n.to?' sb-active':''}`}>
            <span className="sb-icon">{NAV_ICONS[n.label]}</span>{n.label}
          </Link>
        ))}
      </nav>
      <div className="sb-bottom">
        <div className="sb-user-info">
          <div className="sb-avatar" style={{background:'var(--brand)'}}>
            {(localStorage.getItem('username')||'U')[0].toUpperCase()}
          </div>
          <div>
            <div className="sb-uname">{localStorage.getItem('username')||'User'}</div>
            <div className="sb-urole">USER</div>
          </div>
        </div>
        <button className="sb-logout" onClick={()=>{localStorage.clear();navigate('/login')}}>
          {ICONS.logout} Logout
        </button>
      </div>
    </aside>
  )
}

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <aside className="sidebar sb-admin-theme">
      <div className="sb-brand">
        <div className="sb-logo-fallback" style={{background:'var(--admin)'}}>AD</div>
        <span className="sb-name">Admin Panel</span>
      </div>
      <nav className="sb-nav">
        {ADMIN_NAV.map(n => (
          <Link key={n.to} to={n.to} className={`sb-link${location.pathname===n.to?' sb-active-admin':''}`}>
            <span className="sb-icon">{NAV_ICONS[n.label]||ICONS.dot}</span>{n.label}
          </Link>
        ))}
      </nav>
      <div className="sb-bottom">
        <div className="sb-user-info">
          <div className="sb-avatar" style={{background:'var(--admin)'}}>
            {(localStorage.getItem('username')||'A')[0].toUpperCase()}
          </div>
          <div>
            <div className="sb-uname">{localStorage.getItem('username')||'Admin'}</div>
            <div className="sb-urole">ADMIN</div>
          </div>
        </div>
        <button className="sb-logout" onClick={()=>{localStorage.clear();navigate('/login')}}>
          {ICONS.logout} Logout
        </button>
      </div>
    </aside>
  )
}

export function HRSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <aside className="sidebar sb-hr-theme">
      <div className="sb-brand">
        <div className="sb-logo-fallback" style={{background:'var(--hr)'}}>HR</div>
        <span className="sb-name">HR Panel</span>
      </div>
      <nav className="sb-nav">
        {HR_NAV.map(n => (
          <Link key={n.to} to={n.to} className={`sb-link${location.pathname===n.to?' sb-active-hr':''}`}>
            <span className="sb-icon">{NAV_ICONS[n.label]||ICONS.dot}</span>{n.label}
          </Link>
        ))}
      </nav>
      <div className="sb-bottom">
        <div className="sb-user-info">
          <div className="sb-avatar" style={{background:'var(--hr)'}}>
            {(localStorage.getItem('username')||'H')[0].toUpperCase()}
          </div>
          <div>
            <div className="sb-uname">{localStorage.getItem('username')||'HR'}</div>
            <div className="sb-urole">HR</div>
          </div>
        </div>
        <button className="sb-logout" onClick={()=>{localStorage.clear();navigate('/login')}}>
          {ICONS.logout} Logout
        </button>
      </div>
    </aside>
  )
}

const ICONS = {
  logout: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  dot: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>,
}

const NAV_ICONS = {
  'Dashboard':       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  'Job Board':       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  'Post a Job':      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  'My Posts':        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'My Applications': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  'Notifications':   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  'Profile':         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  'Users':           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'Site Header':     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>,
  'Site Footer':     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
  'Navigation':      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>,
  'Footer Nav':      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>,
  'Register Admin':  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
}