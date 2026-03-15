import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirm: '' })
  const [usernameStatus, setUsernameStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [header, setHeader] = useState(null)
  const [touched, setTouched] = useState({})
  const debounceRef = useRef(null)

  useEffect(() => {
    axiosApi.get('/site/header').then(r => setHeader(r.data[0])).catch(() => {})
  }, [])

  const handleUsernameChange = (val) => {
    setForm(f => ({ ...f, username: val }))
    setUsernameStatus(null)
    if (!val) return
    setUsernameStatus('checking')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosApi.get(`/auth/check-username?username=${val}`)
        setUsernameStatus(res.data.exists ? 'taken' : 'available')
      } catch { setUsernameStatus(null) }
    }, 600)
  }

  const validate = {
    phone: v => /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit Indian mobile number',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',
    password: v => {
      if (v.length < 8) return 'At least 8 characters'
      if (!/[A-Z]/.test(v)) return 'At least one uppercase letter'
      if (!/[0-9]/.test(v)) return 'At least one number'
      if (!/[!@#$%^&*]/.test(v)) return 'At least one special character (!@#$%^&*)'
      return ''
    },
    confirm: v => v !== form.password ? 'Passwords do not match' : '',
  }

  const getError = (field) => touched[field] && form[field] ? validate[field]?.(form[field]) : ''

  const handleBlur = (field) => setTouched(t => ({ ...t, [field]: true }))

  const handleSubmit = async () => {
    setTouched({ phone: true, email: true, password: true, confirm: true })
    if (!form.username || !form.email || !form.phone || !form.password || !form.confirm) {
      toast.error('Please fill all fields'); return
    }
    if (validate.phone(form.phone)) { toast.error(validate.phone(form.phone)); return }
    if (validate.email(form.email)) { toast.error(validate.email(form.email)); return }
    if (validate.password(form.password)) { toast.error(validate.password(form.password)); return }
    if (validate.confirm(form.confirm)) { toast.error('Passwords do not match'); return }
    if (usernameStatus === 'taken') { toast.error('Username is already taken'); return }

    setLoading(true)
    try {
      await axiosApi.post('/auth/register', {
        username: form.username,
        userEmail: form.email,
        userPhone: form.phone,
        userPassword: form.password,
      })
      toast.success('Registered successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const statusIcon = { checking: '⏳', available: '✅', taken: '❌' }

  const inputStyle = (field) => ({
    borderColor: getError(field) ? 'var(--danger)' : touched[field] && form[field] && !getError(field) ? 'var(--success)' : ''
  })

  return (
    <div className="auth-bg">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo-wrap">
          {header?.logoUrl
            ? <img src={header.logoUrl} alt="logo" className="auth-logo" />
            : <div className="auth-logo-fallback">JT</div>}
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join {header?.websiteName || 'Job Tracker'} today</p>

        <div className="auth-form">
          <div className="input-group">
            <label>Username {usernameStatus && <span className="status-icon">{statusIcon[usernameStatus]}</span>}</label>
            <input
              type="text" placeholder="Choose a username"
              value={form.username}
              onChange={e => handleUsernameChange(e.target.value)}
              style={{ borderColor: usernameStatus === 'taken' ? 'var(--danger)' : usernameStatus === 'available' ? 'var(--success)' : '' }}
            />
            {usernameStatus === 'taken' && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>Username is already taken</span>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email" placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              style={inputStyle('email')}
            />
            {getError('email') && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{getError('email')}</span>}
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="text" placeholder="10-digit mobile number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              onBlur={() => handleBlur('phone')}
              style={inputStyle('phone')}
            />
            {getError('phone') && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{getError('phone')}</span>}
          </div>

          <div className="auth-row">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password" placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onBlur={() => handleBlur('password')}
                style={inputStyle('password')}
              />
              {getError('password') && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{getError('password')}</span>}
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password" placeholder="Confirm"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                onBlur={() => handleBlur('confirm')}
                style={inputStyle('confirm')}
              />
              {getError('confirm') && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{getError('confirm')}</span>}
            </div>
          </div>

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </div>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}