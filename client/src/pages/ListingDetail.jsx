import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getListingById, deleteListing } from '../api/listings'

const CATEGORY_EMOJI = {
  Electronics: '💻', Clothing: '👕', Books: '📚', Keys: '🔑',
  Wallet: '👛', 'ID/Card': '🪪', Bag: '🎒', Other: '📦'
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getListingById(id)
      .then(res => setListing(res.data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false))
  }, [id])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return
    try {
      await deleteListing(id)
      showToast('Listing deleted.')
      setTimeout(() => navigate('/listings'), 1200)
    } catch {
      showToast('Failed to delete.', 'error')
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const formatPosted = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  if (loading) return <div className="loading"><div className="spinner" />LOADING...</div>

  if (!listing) return (
    <div className="detail-container">
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h3>Listing not found</h3>
        <p>It may have been removed.</p>
        <Link to="/listings" className="btn btn-primary" style={{marginTop:'1rem', display:'inline-flex'}}>← Back to listings</Link>
      </div>
    </div>
  )

  return (
    <div className="detail-container">
      <Link to="/listings" className="back-link">← Back to listings</Link>

      <div className="detail-card">
        {listing.image_path
          ? <img
              className="detail-image"
              src={`http://localhost:3001/uploads/${listing.image_path}`}
              alt={listing.title}
            />
          : <div className="detail-image-placeholder">
              {CATEGORY_EMOJI[listing.category] || '📦'}
            </div>
        }

        <div className="detail-body">
          <div className="detail-header">
            <h1 className="detail-title">{listing.title}</h1>
            <div className="detail-badges">
              <span className={`badge badge-${listing.type}`} style={{fontSize:'0.75rem', padding:'0.3rem 0.7rem'}}>
                {listing.type === 'lost' ? '🔍' : '📦'} {listing.type.toUpperCase()}
              </span>
              <span className="badge" style={{background:'#F0EBE3', color:'#4A4540', fontSize:'0.75rem', padding:'0.3rem 0.7rem'}}>
                {CATEGORY_EMOJI[listing.category]} {listing.category}
              </span>
            </div>
          </div>

          {listing.description && (
            <p className="detail-desc">{listing.description}</p>
          )}

          <div className="detail-grid">
            <div className="detail-field">
              <label>Location</label>
              <p>📍 {listing.location}</p>
            </div>
            <div className="detail-field">
              <label>Date {listing.type === 'lost' ? 'Lost' : 'Found'}</label>
              <p>📅 {formatDate(listing.date)}</p>
            </div>
            <div className="detail-field">
              <label>Posted On</label>
              <p>🕐 {formatPosted(listing.created_at)}</p>
            </div>
            <div className="detail-field">
              <label>Item ID</label>
              <p style={{fontFamily:'monospace', fontSize:'0.75rem'}}>{listing.id.slice(0,8)}...</p>
            </div>
          </div>

          <div className="detail-actions">
            <Link to="/listings" className="btn btn-secondary" style={{background:'var(--cream)', color:'var(--ink)', border:'1.5px solid var(--border)'}}>
              ← All Listings
            </Link>
            <Link to="/new" className="btn btn-sage">
              + Report Another
            </Link>
            <button className="btn" style={{background:'rgba(200,75,47,0.1)', color:'var(--rust)', border:'none'}} onClick={handleDelete}>
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  )
}
