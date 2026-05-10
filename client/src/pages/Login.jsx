import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/listings'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/listings')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎓</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem' }}>Campus Lost & Found</h1>
          <p style={{ color: '#666', margin: 0 }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: 4, padding: '12px', fontSize: '1rem', justifyContent: 'center' }}
          >
            {loading ? '⏳ Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#666', fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
