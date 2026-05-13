import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axiosApi from '../../api/axios'

const EMPTY = { title:'', description:'', qualifications:'', stream:'', companyName:'', location:'', jobType:'FULL_TIME' }

export default function PostJob() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.companyName) {
      toast.error('Title, description and company are required'); return
    }
    setLoading(true)
    try {
      await axiosApi.post('/job-posts', form)
      toast.success('Job posted successfully!')
      navigate('/my-posts')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Post a Job</h1>
      </div>
      <div className="card" style={{maxWidth:700}}>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div className="input-group">
              <label>Job Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Frontend Developer" />
            </div>
            <div className="input-group">
              <label>Company Name *</label>
              <input value={form.companyName} onChange={e => setForm({...form, companyName:e.target.value})} placeholder="e.g. Google" />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="e.g. Bangalore / Remote" />
            </div>
            <div className="input-group">
              <label>Stream / Department</label>
              <input value={form.stream} onChange={e => setForm({...form, stream:e.target.value})} placeholder="e.g. Frontend, Backend, Data" />
            </div>
            <div className="input-group">
              <label>Job Type</label>
              <select value={form.jobType} onChange={e => setForm({...form, jobType:e.target.value})}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Job Description *</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Describe the role, responsibilities…" />
          </div>
          <div className="input-group">
            <label>Qualifications / Requirements</label>
            <textarea rows={4} value={form.qualifications} onChange={e => setForm({...form, qualifications:e.target.value})} placeholder="Required skills, education, experience…" />
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="btn btn-ghost" onClick={() => navigate('/job-board')}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Posting…' : 'Post Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}