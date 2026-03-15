import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

const EMPTY = { aboutText: '', contactEmail: '', copyrightText: '', className: '' }

export default function AdminSiteFooter() {
  const [footers, setFooters] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetch = () => axiosApi.get('/site/footer').then(r => setFooters(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditId(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (f) => { setEditId(f.id); setForm({ aboutText: f.aboutText||'', contactEmail: f.contactEmail||'', copyrightText: f.copyrightText||'', className: f.className||'' }); setShowForm(true) }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (editId) { await axiosApi.put(`/admin/site-footer/${editId}`, form); toast.success('Updated!') }
      else { await axiosApi.post('/admin/site-footer', form); toast.success('Created!') }
      setShowForm(false); fetch()
    } catch { toast.error('Error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return
    try { await axiosApi.delete(`/admin/site-footer/${id}`); toast.success('Deleted'); fetch() }
    catch { toast.error('Error') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Site Footer</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Footer</button>
      </div>
      <div className="card" style={{marginBottom:24}}>
        <table className="data-table">
          <thead><tr><th>About</th><th>Contact Email</th><th>Copyright</th><th>Actions</th></tr></thead>
          <tbody>
            {footers.map(f => (
              <tr key={f.id}>
                <td style={{maxWidth:200}}>{f.aboutText || '—'}</td>
                <td>{f.contactEmail || '—'}</td>
                <td>{f.copyrightText || '—'}</td>
                <td style={{display:'flex',gap:6}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {footers.length === 0 && <p style={{padding:'20px 0',color:'var(--gray-400)',fontSize:14}}>No footer yet.</p>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Footer</h2>
            <div className="input-group"><label>About Text</label><textarea rows={2} value={form.aboutText} onChange={e => setForm({...form, aboutText: e.target.value})} placeholder="About your site…" /></div>
            <div className="input-group"><label>Contact Email</label><input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} placeholder="contact@example.com" /></div>
            <div className="input-group"><label>Copyright Text</label><input value={form.copyrightText} onChange={e => setForm({...form, copyrightText: e.target.value})} placeholder="© 2025 Job Tracker" /></div>
            <div className="input-group"><label>Class Name</label><input value={form.className} onChange={e => setForm({...form, className: e.target.value})} /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading?'Saving…':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
