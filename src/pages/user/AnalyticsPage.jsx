import { useEffect, useState } from 'react'
import axiosApi from '../../api/axios'
import './User.css'

const STATUS_META = {
  APPLIED:   { label: 'Applied',   color: '#2563eb', bg: '#eff6ff' },
  INTERVIEW: { label: 'Interview', color: '#d97706', bg: '#fffbeb' },
  OFFERED:   { label: 'Offered',   color: '#16a34a', bg: '#f0fdf4' },
  REJECTED:  { label: 'Rejected',  color: '#dc2626', bg: '#fef2f2' },
}

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState([])
  useEffect(() => { axiosApi.get('/jobs').then(r => setJobs(r.data)).catch(() => {}) }, [])

  const total = jobs.length
  const byStatus = Object.entries(STATUS_META).map(([key, meta]) => ({
    ...meta, key, count: jobs.filter(j => j.applicationStatus === key).length
  }))

  // by month
  const monthMap = {}
  jobs.forEach(j => {
    if (!j.appliedDate) return
    const month = j.appliedDate.slice(0, 7)
    monthMap[month] = (monthMap[month] || 0) + 1
  })
  const months = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).slice(-6)
  const maxMonth = Math.max(...months.map(([, v]) => v), 1)

  const successRate = total ? Math.round((jobs.filter(j => j.applicationStatus === 'OFFERED').length / total) * 100) : 0

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
      </div>

      <div className="stats-grid" style={{marginBottom: 24}}>
        <div className="stat-card" style={{background:'#eff6ff', borderColor:'#bfdbfe'}}>
          <div className="stat-icon">📋</div>
          <div className="stat-value" style={{color:'#2563eb'}}>{total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card" style={{background:'#f0fdf4', borderColor:'#bbf7d0'}}>
          <div className="stat-icon">🎉</div>
          <div className="stat-value" style={{color:'#16a34a'}}>{successRate}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-card" style={{background:'#fffbeb', borderColor:'#fde68a'}}>
          <div className="stat-icon">🗣️</div>
          <div className="stat-value" style={{color:'#d97706'}}>{jobs.filter(j=>j.applicationStatus==='INTERVIEW').length}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card" style={{background:'#fef2f2', borderColor:'#fecaca'}}>
          <div className="stat-icon">❌</div>
          <div className="stat-value" style={{color:'#dc2626'}}>{jobs.filter(j=>j.applicationStatus==='REJECTED').length}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div className="card">
          <h2 className="section-title" style={{marginBottom:16}}>By Status</h2>
          {byStatus.map(s => (
            <div key={s.key} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:600,marginBottom:4}}>
                <span style={{color:s.color}}>{s.label}</span>
                <span>{s.count}</span>
              </div>
              <div style={{height:8, background:'#f1f5f9', borderRadius:999, overflow:'hidden'}}>
                <div style={{height:'100%', width: total ? `${(s.count/total)*100}%` : '0%', background:s.color, borderRadius:999, transition:'width 0.5s'}} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="section-title" style={{marginBottom:16}}>Applications Per Month</h2>
          {months.length === 0 && <p className="empty-msg">No data yet</p>}
          <div style={{display:'flex', alignItems:'flex-end', gap:10, height:140}}>
            {months.map(([month, count]) => (
              <div key={month} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                <div style={{fontSize:11, fontWeight:700, color:'#2563eb'}}>{count}</div>
                <div style={{width:'100%', background:'#2563eb', borderRadius:'4px 4px 0 0', height:`${(count/maxMonth)*100}%`, minHeight:4, transition:'height 0.5s'}} />
                <div style={{fontSize:10, color:'var(--gray-400)', textAlign:'center'}}>{month.slice(5)}/{month.slice(2,4)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
