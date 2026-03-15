import { useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

export default function HRRegisterAdmin() {
  const [form, setForm] = useState({ username: '', userEmail: '', userPhone: '', userPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.username || !form.userEmail || !form.userPhone || !form.userPassword) {
      toast.error('All fields are required'); return
    }
    setLoading(true)
    try {
      await axiosApi.post('/hr/register-admin', form)
      toast.success(`Admin "${form.username}" registered successfully!`)
      setForm({ username: '', userEmail: '', userPhone: '', userPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Register Admin</h1>
      </div>
      <div className="card" style={{maxWidth:480}}>
        <p style={{fontSize:14, color:'var(--gray-500)', marginBottom:20}}>
          Create a new Admin account. The admin will be able to manage site settings and users.
        </p>
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <div className="input-group">
            <label>Username *</label>
            <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Choose username" />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input type="email" value={form.userEmail} onChange={e => setForm({...form, userEmail: e.target.value})} placeholder="admin@example.com" />
          </div>
          <div className="input-group">
            <label>Phone *</label>
            <input value={form.userPhone} onChange={e => setForm({...form, userPhone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="input-group">
            <label>Password *</label>
            <input type="password" value={form.userPassword} onChange={e => setForm({...form, userPassword: e.target.value})} placeholder="Set password" />
          </div>
          <button className="btn btn-primary" style={{background:'var(--hr)'}} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Registering…' : 'Register Admin'}
          </button>
        </div>
      </div>
    </div>
  )
}
