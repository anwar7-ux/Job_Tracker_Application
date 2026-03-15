import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './User.css'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ userEmail: '', userPhone: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axiosApi.get('/user/profile').then(r => {
      setProfile(r.data)
      setForm({ userEmail: r.data.userEmail || '', userPhone: r.data.userPhone || '' })
    }).catch(() => {})
  }, [])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await axiosApi.put('/user/profile', form)
      toast.success('Profile updated!')
      setEditMode(false)
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  const handlePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('Fill all password fields'); return }
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await axiosApi.put('/user/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
            <h2 className="section-title">Personal Info</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <div className="input-group">
              <label>Username</label>
              <input value={profile?.username || ''} disabled style={{background:'var(--gray-50)'}} />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input value={form.userEmail} disabled={!editMode} onChange={e => setForm({...form, userEmail: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input value={form.userPhone} disabled={!editMode} onChange={e => setForm({...form, userPhone: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Role</label>
              <input value={profile?.role || ''} disabled style={{background:'var(--gray-50)'}} />
            </div>
            {editMode && (
              <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title" style={{marginBottom:16}}>Change Password</h2>
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} placeholder="Enter current password" />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} placeholder="Enter new password" />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} placeholder="Confirm new password" />
            </div>
            <button className="btn btn-primary" onClick={handlePassword} disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
