import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import './Layouts.css'

export function UserLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content"><Outlet /></main>
    </div>
  )
}

const ADMIN_NAV = [
  { to: '/admin',                  label: 'Dashboard',        icon: AdminDashIcon },
  { to: '/admin/users',            label: 'Users',            icon: UsersIcon },
  { to: '/admin/site-header',      label: 'Site Header',      icon: ImageIcon },
  { to: '/admin/site-footer',      label: 'Site Footer',      icon: FooterIcon },
  { to: '/admin/navigation',       label: 'Navigation',       icon: NavIcon },
  { to: '/admin/footer-navigation',label: 'Footer Nav',       icon: NavIcon },
]

const HR_NAV = [
  { to: '/hr',                label: 'Dashboard',       icon: AdminDashIcon },
  { to: '/hr/register-admin', label: 'Register Admin',  icon: UsersIcon },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div className="layout">
      <aside className="sidebar admin-sidebar">
        <div className="sb-brand">
          <div className="sb-logo-placeholder" style={{background:'var(--admin)'}}>AD</div>
          <span className="sb-name">Admin Panel</span>
        </div>
        <nav className="sb-nav">
          {ADMIN_NAV.map(n => {
            const active = location.pathname === n.to
            return (
              <Link key={n.to} to={n.to} className={`sb-link${active ? ' sb-active-admin' : ''}`}>
                <span className="sb-icon"><n.icon /></span>{n.label}
              </Link>
            )
          })}
        </nav>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar" style={{background:'var(--admin)'}}>A</div>
            <div><div className="sb-username">{localStorage.getItem('username')}</div><div className="sb-role">ADMIN</div></div>
          </div>
          <button className="sb-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>
      <main className="layout-content"><Outlet /></main>
    </div>
  )
}

export function HRLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <div className="layout">
      <aside className="sidebar hr-sidebar">
        <div className="sb-brand">
          <div className="sb-logo-placeholder" style={{background:'var(--hr)'}}>HR</div>
          <span className="sb-name">HR Panel</span>
        </div>
        <nav className="sb-nav">
          {HR_NAV.map(n => {
            const active = location.pathname === n.to
            return (
              <Link key={n.to} to={n.to} className={`sb-link${active ? ' sb-active-hr' : ''}`}>
                <span className="sb-icon"><n.icon /></span>{n.label}
              </Link>
            )
          })}
        </nav>
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar" style={{background:'var(--hr)'}}>H</div>
            <div><div className="sb-username">{localStorage.getItem('username')}</div><div className="sb-role">HR</div></div>
          </div>
          <button className="sb-logout" onClick={() => { localStorage.clear(); navigate('/login') }}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>
      <main className="layout-content"><Outlet /></main>
    </div>
  )
}

function AdminDashIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function UsersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function ImageIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function FooterIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg> }
function NavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg> }
function LogoutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
