import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

const EMPTY = { buttonName: '', src: '', className: '' }

export default function AdminNavigation() {
  const [navs, setNavs] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetch = () => axiosApi.get('/site/navigation').then(r => setNavs(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditId(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (n) => { setEditId(n.id); setForm({ buttonName: n.buttonName||'', src: n.src||'', className: n.className||'' }); setShowForm(true) }

  const handleSave = async () => {
    if (!form.buttonName) { toast.error('Button name required'); return }
    setLoading(true)
    try {
      if (editId) { await axiosApi.put(`/admin/navigation/${editId}`, form); toast.success('Updated!') }
      else { await axiosApi.post('/admin/navigation', form); toast.success('Created!') }
      setShowForm(false); fetch()
    } catch { toast.error('Error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return
    try { await axiosApi.delete(`/admin/navigation/${id}`); toast.success('Deleted'); fetch() }
    catch { toast.error('Error') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Navigation Links</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Link</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Button Name</th><th>URL/Src</th><th>Class Name</th><th>Actions</th></tr></thead>
          <tbody>
            {navs.map(n => (
              <tr key={n.id}>
                <td><strong>{n.buttonName}</strong></td>
                <td>{n.src || '—'}</td>
                <td>{n.className || '—'}</td>
                <td style={{display:'flex',gap:6}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(n)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {navs.length === 0 && <p style={{padding:'20px 0',color:'var(--gray-400)',fontSize:14}}>No navigation links yet.</p>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Navigation Link</h2>
            <div className="input-group"><label>Button Name *</label><input value={form.buttonName} onChange={e => setForm({...form, buttonName: e.target.value})} placeholder="e.g. Home" /></div>
            <div className="input-group"><label>URL / Src</label><input value={form.src} onChange={e => setForm({...form, src: e.target.value})} placeholder="/home" /></div>
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
