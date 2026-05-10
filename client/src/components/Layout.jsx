import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Only show nav when logged in */}
      {user && (
        <header style={{
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          padding: '0 2rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 60,
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <Link to="/listings" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', textDecoration: 'none' }}>
            🎓 Campus Lost & Found
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/listings" style={{ color: '#555', textDecoration: 'none', fontSize: '0.95rem' }}>Browse</Link>
            <Link to="/new" style={{ color: '#555', textDecoration: 'none', fontSize: '0.95rem' }}>Report Item</Link>

            {isAdmin && (
              <Link to="/admin" style={{
                background: '#6366f1', color: '#fff', padding: '5px 14px',
                borderRadius: 20, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600
              }}>
                🛡️ Admin
              </Link>
            )}

            <span style={{ color: '#999', fontSize: '0.85rem' }}>👤 {user.username}</span>

            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid #d1d5db', borderRadius: 20,
              padding: '5px 14px', cursor: 'pointer', fontSize: '0.85rem', color: '#555'
            }}>
              Sign Out
            </button>
          </nav>
        </header>
      )}

      <main>
        <Outlet />
      </main>
    </>
  )
}
