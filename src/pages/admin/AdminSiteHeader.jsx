import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

const EMPTY = { websiteName: '', logoUrl: '', className: '' }

export default function AdminSiteHeader() {
  const [headers, setHeaders] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetch = () => axiosApi.get('/site/header').then(r => setHeaders(r.data)).catch(() => {})
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditId(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (h) => { setEditId(h.id); setForm({ websiteName: h.websiteName, logoUrl: h.logoUrl, className: h.className || '' }); setShowForm(true) }

  const handleSave = async () => {
    if (!form.websiteName) { toast.error('Website name is required'); return }
    setLoading(true)
    try {
      if (editId) { await axiosApi.put(`/admin/site-header/${editId}`, form); toast.success('Updated!') }
      else { await axiosApi.post('/admin/site-header', form); toast.success('Created!') }
      setShowForm(false); fetch()
    } catch { toast.error('Error saving') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return
    try { await axiosApi.delete(`/admin/site-header/${id}`); toast.success('Deleted'); fetch() }
    catch { toast.error('Error') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Site Header</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Header</button>
      </div>

      <div className="card" style={{marginBottom:24}}>
        <table className="data-table">
          <thead><tr><th>Website Name</th><th>Logo URL</th><th>Class Name</th><th>Actions</th></tr></thead>
          <tbody>
            {headers.map(h => (
              <tr key={h.id}>
                <td><strong>{h.websiteName}</strong></td>
                <td style={{maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {h.logoUrl ? <a href={h.logoUrl} target="_blank" rel="noreferrer" style={{color:'var(--brand)',fontSize:13}}>View Logo</a> : '—'}
                </td>
                <td>{h.className || '—'}</td>
                <td style={{display:'flex',gap:6}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {headers.length === 0 && <p style={{padding:'20px 0',color:'var(--gray-400)',fontSize:14}}>No headers yet.</p>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editId ? 'Edit' : 'Add'} Site Header</h2>
            <div className="input-group"><label>Website Name *</label><input value={form.websiteName} onChange={e => setForm({...form, websiteName: e.target.value})} placeholder="My Job Tracker" /></div>
            <div className="input-group"><label>Logo URL</label><input value={form.logoUrl} onChange={e => setForm({...form, logoUrl: e.target.value})} placeholder="https://drive.google.com/uc?export=view&id=..." /></div>
            <div className="input-group"><label>Class Name</label><input value={form.className} onChange={e => setForm({...form, className: e.target.value})} placeholder="optional CSS class" /></div>
            {form.logoUrl && <img src={form.logoUrl} alt="preview" style={{width:60,height:60,objectFit:'contain',borderRadius:8,border:'1px solid var(--gray-200)'}} />}
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
