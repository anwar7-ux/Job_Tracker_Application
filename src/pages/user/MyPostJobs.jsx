import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

const STATUSES = ['PENDING','RESUME_REVIEW','INTERVIEW','OFFERED','REJECTED']
const STATUS_BADGE = {
  PENDING:'badge-gray', RESUME_REVIEW:'badge-yellow',
  INTERVIEW:'badge-purple', OFFERED:'badge-green', REJECTED:'badge-red'
}

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = () => axiosApi.get('/job-posts/mine').then(r => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { fetchPosts() }, [])

  const viewApplicants = async (post) => {
    setSelectedPost(post)
    const res = await axiosApi.get(`/job-apply/applicants/${post.id}`)
    setApplicants(res.data)
  }

  const updateStatus = async (applyId, status) => {
    try {
      await axiosApi.put(`/job-apply/${applyId}/status?status=${status}`)
      toast.success('Status updated!')
      const res = await axiosApi.get(`/job-apply/applicants/${selectedPost.id}`)
      setApplicants(res.data)
    } catch { toast.error('Error updating status') }
  }

  const closeJob = async (postId) => {
    if (!window.confirm('Close this job?')) return
    try {
      await axiosApi.put(`/job-posts/${postId}/close`)
      toast.success('Job closed!')
      fetchPosts()
      if (selectedPost?.id === postId) setSelectedPost(null)
    } catch { toast.error('Error') }
  }

  const deleteJob = async (postId) => {
    if (!window.confirm('Delete this job?')) return
    try {
      await axiosApi.delete(`/job-posts/${postId}`)
      toast.success('Job deleted!')
      fetchPosts()
      if (selectedPost?.id === postId) setSelectedPost(null)
    } catch { toast.error('Error') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Posted Jobs</h1>
      </div>

      <div style={{display:'grid', gridTemplateColumns: selectedPost ? '1fr 1fr' : '1fr', gap:20}}>
        {/* Jobs List */}
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {loading && <p className="empty-msg">Loading…</p>}
          {!loading && posts.length === 0 && <p className="empty-msg">No jobs posted yet.</p>}
          {posts.map(post => (
            <div key={post.id} className="card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <h3 style={{fontSize:15, fontWeight:700}}>{post.title}</h3>
                  <p style={{fontSize:13, color:'var(--gray-500)'}}>🏢 {post.companyName}</p>
                </div>
                <span className={`badge ${post.status==='OPEN'?'badge-green':'badge-red'}`}>{post.status}</span>
              </div>
              <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
                {post.location && <span className="badge badge-gray">📍 {post.location}</span>}
                {post.stream && <span className="badge badge-blue">🎯 {post.stream}</span>}
                <span className="badge badge-yellow">👥 {post.applicantCount} applicants</span>
              </div>
              <div style={{display:'flex', gap:8, marginTop:10}}>
                <button className="btn btn-primary btn-sm" onClick={() => viewApplicants(post)}>View Applicants</button>
                {post.status === 'OPEN' && <button className="btn btn-ghost btn-sm" onClick={() => closeJob(post.id)}>Close Job</button>}
                <button className="btn btn-danger btn-sm" onClick={() => deleteJob(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Applicants Panel */}
        {selectedPost && (
          <div>
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 className="section-title">Applicants for: {selectedPost.title}</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPost(null)}>✕ Close</button>
              </div>
            </div>
            {applicants.length === 0 && <p className="empty-msg">No applicants yet.</p>}
            {applicants.map(app => (
              <div key={app.id} className="card" style={{marginBottom:12}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <h3 style={{fontSize:14, fontWeight:700}}>{app.fullName}</h3>
                    <p style={{fontSize:12, color:'var(--gray-500)'}}>@{app.applicantUsername}</p>
                  </div>
                  <span className={`badge ${STATUS_BADGE[app.status]||'badge-gray'}`}>{app.status}</span>
                </div>
                <div style={{fontSize:13, color:'var(--gray-600)', marginTop:8, display:'flex', flexDirection:'column', gap:4}}>
                  <p>📧 {app.email}</p>
                  <p>📞 {app.phone}</p>
                  <p>💼 {app.experience}</p>
                  {app.resumeLink && <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{color:'var(--brand)', fontWeight:600}}>📄 View Resume</a>}
                  {app.coverLetter && <p style={{fontSize:12, marginTop:4, color:'var(--gray-500)'}}>"{app.coverLetter}"</p>}
                </div>
                <div style={{marginTop:10}}>
                  <p style={{fontSize:12, fontWeight:600, color:'var(--gray-600)', marginBottom:6}}>Update Status:</p>
                  <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => updateStatus(app.id, s)}
                      >
                        {s.replace('_',' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}