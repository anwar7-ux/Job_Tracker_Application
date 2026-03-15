import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './User.css'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = () => axiosApi.get('/notifications').then(r => setNotifications(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const markRead = async (id) => {
    try {
      await axiosApi.put(`/notifications/${id}/read`)
      setNotifications(n => n.map(x => x.id === id ? {...x, read: true} : x))
    } catch { toast.error('Error') }
  }

  const markAll = async () => {
    try {
      await axiosApi.put('/notifications/read-all')
      setNotifications(n => n.map(x => ({...x, read: true})))
      toast.success('All marked as read')
    } catch { toast.error('Error') }
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Notifications {unread > 0 && <span className="badge badge-blue" style={{marginLeft:8, fontSize:13}}>{unread}</span>}</h1>
        {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all as read</button>}
      </div>

      <div className="card">
        {loading && <p className="empty-msg">Loading…</p>}
        {!loading && notifications.length === 0 && <p className="empty-msg">No notifications yet.</p>}
        {notifications.map(n => (
          <div key={n.id} className={`notif-item${n.read ? '' : ' notif-unread'}`}>
            <div className="notif-dot" style={{background: n.read ? 'var(--gray-300)' : 'var(--brand)'}} />
            <div style={{flex:1}}>
              <div className="notif-msg">{n.message}</div>
              <div className="notif-date">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && (
              <button className="btn btn-ghost btn-sm" onClick={() => markRead(n.id)}>Mark read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
