import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getListings, deleteListing } from '../api/listings'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  // Guard: redirect non-admins
  useEffect(() => {
    if (!user) navigate('/login')
    else if (!isAdmin) navigate('/')
  }, [user, isAdmin, navigate])

  useEffect(() => {
    if (isAdmin) {
      getListings()
        .then(res => setListings(res.data))
        .catch(() => setListings([]))
        .finally(() => setLoading(false))
    }
  }, [isAdmin])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAdmin) return null

  const lost = listings.filter(l => l.type === 'lost')
  const found = listings.filter(l => l.type === 'found')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0 }}>🛡️ Admin Dashboard</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Logged in as <strong>{user.username}</strong></p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">Sign Out</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Listings', value: listings.length, color: '#6366f1' },
          { label: 'Lost Reports', value: lost.length, color: '#ef4444' },
          { label: 'Found Items', value: found.length, color: '#22c55e' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Listings Table */}
      <h2 style={{ marginBottom: 16 }}>All Listings</h2>
      {loading ? (
        <p>Loading…</p>
      ) : listings.length === 0 ? (
        <p style={{ color: '#666' }}>No listings yet.</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                {['Title', 'Type', 'Category', 'Location', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listings.map((item, i) => (
                <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                      background: item.type === 'lost' ? '#fee2e2' : '#dcfce7',
                      color: item.type === 'lost' ? '#b91c1c' : '#15803d'
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{item.category}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{item.location}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(item.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={deleting === item.id}
                      style={{
                        background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6,
                        padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500
                      }}
                    >
                      {deleting === item.id ? '…' : '🗑 Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
