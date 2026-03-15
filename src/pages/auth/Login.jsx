import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [header, setHeader] = useState(null)

  useEffect(() => {
    axiosApi.get('/site/header')
      .then(r => setHeader(r.data[0]))
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const res = await axiosApi.post('/auth/login', {
        username: form.username,
        userPassword: form.password
      })

      const { token, role } = res.data

      // ✅ sessionStorage auto-clears when browser/tab closes
      // User will be logged out automatically on browser close
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('role', role)
      sessionStorage.setItem('username', form.username)

      toast.success('Welcome back!')

      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'HR') navigate('/hr')
      else navigate('/dashboard')

    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          {header?.logoUrl
            ? <img src={header.logoUrl} alt="logo" className="auth-logo" />
            : <div className="auth-logo-fallback">JT</div>}
        </div>

        <h1 className="auth-title">{header?.websiteName || 'Job Tracker'}</h1>
        <p className="auth-sub">Sign in to your account</p>

        <div className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* ✅ Forgot Password link */}
          <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '13px' }}>
              Forgot Password?
            </Link>
          </div>

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}