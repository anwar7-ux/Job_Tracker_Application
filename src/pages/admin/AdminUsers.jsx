import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  // ✅ Get current logged-in username to prevent self-deactivation
  const currentUsername = sessionStorage.getItem('username')

  const fetchUsers = () => {
    axiosApi.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleActive = async (id, current, username) => {
    // ✅ Prevent admin from deactivating their own account
    if (username === currentUsername) {
      toast.warning("You can't deactivate your own account!")
      return
    }
    try {
      await axiosApi.put(`/admin/users/${id}/status?isActive=${!current}`)
      toast.success(`User ${current ? 'deactivated' : 'activated'} successfully`)
      fetchUsers()
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <input
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1.5px solid var(--gray-200)',
            fontSize: 14,
            outline: 'none',
            width: 220
          }}
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>
                  <strong>{u.username}</strong>
                  {u.username === currentUsername && (
                    <span style={{
                      marginLeft: 6,
                      fontSize: 11,
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '2px 6px',
                      borderRadius: 4
                    }}>You</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-blue' : u.role === 'HR' ? 'badge-green' : 'badge-gray'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-ghost'}`}
                    onClick={() => toggleActive(u.id, u.active, u.username)}
                    disabled={u.username === currentUsername}
                    title={u.username === currentUsername ? "Can't deactivate your own account" : ''}
                    style={u.username === currentUsername ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ padding: '20px 0', color: 'var(--gray-400)', fontSize: 14 }}>
            No users found.
          </p>
        )}
      </div>
    </div>
  )
}