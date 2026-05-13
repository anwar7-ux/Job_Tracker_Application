import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'

const STEPS = ['PENDING','RESUME_REVIEW','INTERVIEW','OFFERED']
const STATUS_BADGE = {
  PENDING:'badge-gray', RESUME_REVIEW:'badge-yellow',
  INTERVIEW:'badge-purple', OFFERED:'badge-green', REJECTED:'badge-red'
}

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosApi.get('/job-apply/mine').then(r => setApps(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
      </div>

      {loading && <p className="empty-msg">Loading…</p>}
      {!loading && apps.length === 0 && (
        <p className="empty-msg">No applications yet. Go to <strong>Job Board</strong> to apply!</p>
      )}

      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        {apps.map(app => (
          <div key={app.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
              <div>
                <h3 style={{fontSize:16, fontWeight:700}}>{app.jobTitle}</h3>
                <p style={{fontSize:13, color:'var(--gray-500)'}}>🏢 {app.companyName} • 📅 Applied: {app.appliedDate}</p>
              </div>
              <span className={`badge ${STATUS_BADGE[app.status]||'badge-gray'}`}>{app.status?.replace('_',' ')}</span>
            </div>

            {/* Status Steps */}
            {app.status !== 'REJECTED' ? (
              <div style={{display:'flex', alignItems:'center', gap:0, marginTop:8}}>
                {STEPS.map((step, i) => {
                  const stepIndex = STEPS.indexOf(app.status)
                  const isDone = i <= stepIndex
                  return (
                    <div key={step} style={{display:'flex', alignItems:'center', flex:1}}>
                      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                        <div style={{
                          width:28, height:28, borderRadius:'50%',
                          background: isDone ? 'var(--brand)' : 'var(--gray-200)',
                          color: isDone ? '#fff' : 'var(--gray-400)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:12, fontWeight:700
                        }}>
                          {isDone ? '✓' : i+1}
                        </div>
                        <span style={{fontSize:10, color: isDone ? 'var(--brand)' : 'var(--gray-400)', fontWeight:600, textAlign:'center', whiteSpace:'nowrap'}}>
                          {step.replace('_',' ')}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{flex:1, height:2, background: i < stepIndex ? 'var(--brand)' : 'var(--gray-200)', margin:'0 4px', marginBottom:16}} />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{background:'var(--danger-light)', borderRadius:8, padding:'10px 14px', marginTop:8}}>
                <p style={{color:'var(--danger)', fontSize:13, fontWeight:600}}>❌ Application Rejected</p>
                <p style={{color:'var(--danger)', fontSize:12, marginTop:2}}>Unfortunately your application was not selected this time.</p>
              </div>
            )}

            {app.status === 'OFFERED' && (
              <div style={{background:'#f0fdf4', borderRadius:8, padding:'10px 14px', marginTop:8}}>
                <p style={{color:'#16a34a', fontSize:13, fontWeight:600}}>🎉 Congratulations! You received a Job Offer!</p>
                <p style={{color:'#16a34a', fontSize:12, marginTop:2}}>The company will contact you with further details.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}