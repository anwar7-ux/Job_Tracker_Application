import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './User.css'
import './Kanban.css'

const COLUMNS = [
  { key: 'APPLIED',   label: 'Applied',   color: '#2563eb', bg: '#eff6ff' },
  { key: 'INTERVIEW', label: 'Interview', color: '#d97706', bg: '#fffbeb' },
  { key: 'OFFERED',   label: 'Offered',   color: '#16a34a', bg: '#f0fdf4' },
  { key: 'REJECTED',  label: 'Rejected',  color: '#dc2626', bg: '#fef2f2' },
]

const EMPTY_FORM = { jobTitle: '', companyName: '', appliedDate: '', applicationStatus: 'APPLIED', jobDescription: '', jobQualifications: '', jobStream: '' }

export default function KanbanPage() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const fetchJobs = () => axiosApi.get('/jobs').then(r => setJobs(r.data)).catch(() => {})
  useEffect(() => { fetchJobs() }, [])

  const openAdd = () => { setEditJob(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (j) => {
    setEditJob(j)
    setForm({ jobTitle: j.jobTitle, companyName: j.companyName, appliedDate: j.appliedDate, applicationStatus: j.applicationStatus, jobDescription: j.jobInformation?.jobDescription || '', jobQualifications: j.jobInformation?.jobQualifications || '', jobStream: j.jobInformation?.jobStream || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.jobTitle || !form.companyName || !form.appliedDate) { toast.error('Title, company and date are required'); return }
    setLoading(true)
    try {
      if (editJob) {
        await axiosApi.put(`/jobs/${editJob.id}`, form)
        toast.success('Job updated!')
      } else {
        await axiosApi.post('/jobs', form)
        toast.success('Job added!')
      }
      setShowModal(false); fetchJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving job')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return
    try {
      await axiosApi.delete(`/jobs/${id}`)
      toast.success('Deleted'); fetchJobs()
    } catch { toast.error('Error deleting') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Jobs</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Job</button>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colJobs = jobs.filter(j => j.applicationStatus === col.key)
          return (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header" style={{ borderTopColor: col.color }}>
                <span className="kanban-col-title" style={{ color: col.color }}>{col.label}</span>
                <span className="kanban-col-count" style={{ background: col.bg, color: col.color }}>{colJobs.length}</span>
              </div>
              <div className="kanban-cards">
                {colJobs.length === 0 && <div className="kanban-empty">No jobs here</div>}
                {colJobs.map(j => (
                  <div key={j.id} className="kanban-card">
                    <div className="kc-title">{j.jobTitle}</div>
                    <div className="kc-company">🏢 {j.companyName}</div>
                    <div className="kc-date">📅 {j.appliedDate}</div>
                    {j.jobInformation?.jobStream && <div className="kc-stream">🎯 {j.jobInformation.jobStream}</div>}
                    <div className="kc-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(j)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(j.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{maxWidth: 540}}>
            <h2 className="modal-title">{editJob ? 'Edit Job' : 'Add New Job'}</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div className="input-group">
                <label>Job Title *</label>
                <input value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} placeholder="e.g. Software Engineer" />
              </div>
              <div className="input-group">
                <label>Company *</label>
                <input value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="e.g. Google" />
              </div>
              <div className="input-group">
                <label>Applied Date *</label>
                <input type="date" value={form.appliedDate} onChange={e => setForm({...form, appliedDate: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Status</label>
                <select value={form.applicationStatus} onChange={e => setForm({...form, applicationStatus: e.target.value})}>
                  {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Job Stream</label>
                <input value={form.jobStream} onChange={e => setForm({...form, jobStream: e.target.value})} placeholder="e.g. Frontend" />
              </div>
              <div className="input-group" style={{gridColumn:'1/-1'}}>
                <label>Job Description</label>
                <textarea rows={2} value={form.jobDescription} onChange={e => setForm({...form, jobDescription: e.target.value})} placeholder="Brief description…" />
              </div>
              <div className="input-group" style={{gridColumn:'1/-1'}}>
                <label>Qualifications</label>
                <textarea rows={2} value={form.jobQualifications} onChange={e => setForm({...form, jobQualifications: e.target.value})} placeholder="Required qualifications…" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save Job'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
