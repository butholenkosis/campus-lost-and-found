import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/listings'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await registerUser({ username: form.username, password: form.password })
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try a different username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎓</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem' }}>Create Account</h1>
          <p style={{ color: '#666', margin: 0 }}>Join Campus Lost & Found</p>
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
              placeholder="Choose a username"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.9rem' }}>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter your password"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: 4, padding: '12px', fontSize: '1rem', justifyContent: 'center' }}
          >
            {loading ? '⏳ Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#666', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
