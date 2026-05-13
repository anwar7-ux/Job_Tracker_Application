import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import axiosApi from '../../api/axios'

const publicApi = axios.create({ baseURL: 'https://job-tracker-backend-x9nc.onrender.com/api' })

const EMPTY_FORM = { fullName:'', email:'', phone:'', experience:'', coverLetter:'', resumeLink:'' }

export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [applying, setApplying] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailJob, setDetailJob] = useState(null)

  const fetchJobs = (kw = '') => {
    setLoading(true)
    const url = kw ? `/job-posts/search?keyword=${kw}` : '/job-posts'
    publicApi.get(url)
      .then(r => setJobs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(keyword)
  }

  const openApply = (job) => {
    setSelectedJob(job)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openDetail = (job) => {
    setDetailJob(job)
    setShowDetail(true)
  }

  const handleApply = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.resumeLink) {
      toast.error('Please fill all required fields'); return
    }
    setApplying(true)
    try {
      const res = await axiosApi.post(`/job-apply/${selectedJob.id}`, form)
      toast.success(res.data)
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error applying')
    } finally { setApplying(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Job Board</h1>
        <form onSubmit={handleSearch} style={{display:'flex', gap:8}}>
          <input
            style={{padding:'8px 14px', borderRadius:8, border:'1.5px solid var(--gray-200)', fontSize:14, outline:'none', width:220}}
            placeholder="Search jobs…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
          {keyword && <button className="btn btn-ghost" type="button" onClick={() => { setKeyword(''); fetchJobs() }}>Clear</button>}
        </form>
      </div>

      {loading && <p className="empty-msg">Loading jobs…</p>}
      {!loading && jobs.length === 0 && <p className="empty-msg">No jobs found.</p>}

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16}}>
        {jobs.map(job => (
          <div key={job.id} className="card" style={{display:'flex', flexDirection:'column', gap:10}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <h3 style={{fontSize:16, fontWeight:700, color:'var(--gray-900)'}}>{job.title}</h3>
                <p style={{fontSize:13, color:'var(--gray-500)', marginTop:2}}>🏢 {job.companyName}</p>
              </div>
              <span className="badge badge-green">{job.jobType?.replace('_',' ')}</span>
            </div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {job.location && <span className="badge badge-gray">📍 {job.location}</span>}
              {job.stream && <span className="badge badge-blue">🎯 {job.stream}</span>}
            </div>
            <p style={{fontSize:13, color:'var(--gray-600)', lineHeight:1.5}}>
              {job.description?.slice(0,100)}{job.description?.length > 100 ? '…' : ''}
            </p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto'}}>
              <span style={{fontSize:12, color:'var(--gray-400)'}}>
                👤 {job.postedByUsername} • 📅 {job.postedDate} • {job.applicantCount} applicants
              </span>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={() => openDetail(job)}>View Details</button>
              <button className="btn btn-primary btn-sm" onClick={() => openApply(job)}>Apply Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      {showDetail && detailJob && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-box" style={{maxWidth:600}} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{detailJob.title}</h2>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:8}}>
              <span className="badge badge-blue">{detailJob.companyName}</span>
              <span className="badge badge-green">{detailJob.jobType?.replace('_',' ')}</span>
              {detailJob.location && <span className="badge badge-gray">📍 {detailJob.location}</span>}
              {detailJob.stream && <span className="badge badge-yellow">🎯 {detailJob.stream}</span>}
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              <div>
                <p style={{fontWeight:700, fontSize:14, marginBottom:4}}>Description</p>
                <p style={{fontSize:14, color:'var(--gray-600)', lineHeight:1.6}}>{detailJob.description}</p>
              </div>
              <div>
                <p style={{fontWeight:700, fontSize:14, marginBottom:4}}>Qualifications</p>
                <p style={{fontSize:14, color:'var(--gray-600)', lineHeight:1.6}}>{detailJob.qualifications}</p>
              </div>
              <p style={{fontSize:12, color:'var(--gray-400)'}}>Posted by {detailJob.postedByUsername} on {detailJob.postedDate}</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowDetail(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setShowDetail(false); openApply(detailJob) }}>Apply Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" style={{maxWidth:540}} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Apply for {selectedJob.title}</h2>
            <p style={{fontSize:13, color:'var(--gray-500)', marginTop:-8}}>🏢 {selectedJob.companyName}</p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div className="input-group">
                <label>Full Name *</label>
                <input value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="Your full name" />
              </div>
              <div className="input-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="your@email.com" />
              </div>
              <div className="input-group">
                <label>Phone *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="input-group">
                <label>Years of Experience *</label>
                <input value={form.experience} onChange={e => setForm({...form, experience:e.target.value})} placeholder="e.g. 2 years" />
              </div>
              <div className="input-group" style={{gridColumn:'1/-1'}}>
                <label>Resume Link * (Google Drive URL)</label>
                <input value={form.resumeLink} onChange={e => setForm({...form, resumeLink:e.target.value})} placeholder="https://drive.google.com/..." />
              </div>
              <div className="input-group" style={{gridColumn:'1/-1'}}>
                <label>Cover Letter</label>
                <textarea rows={3} value={form.coverLetter} onChange={e => setForm({...form, coverLetter:e.target.value})} placeholder="Why are you a good fit for this role?" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying}>{applying ? 'Applying…' : 'Submit Application'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}