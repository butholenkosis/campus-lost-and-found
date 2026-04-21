import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getListings } from '../api/listings'

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Books', 'Keys', 'Wallet', 'ID/Card', 'Bag', 'Other']
const CATEGORY_EMOJI = {
  Electronics: '💻', Clothing: '👕', Books: '📚', Keys: '🔑',
  Wallet: '👛', 'ID/Card': '🪪', Bag: '🎒', Other: '📦', '': '🔎'
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  const fetchListings = useCallback(() => {
    setLoading(true)
    const params = {}
    if (type) params.type = type
    if (category) params.category = category
    if (search) params.search = search
    getListings(params)
      .then(res => setListings(res.data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [type, category, search])

  useEffect(() => { fetchListings() }, [fetchListings])

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val)
    else next.delete(key)
    setSearchParams(next)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <h1 className="page-title">
            {type === 'lost' ? '🔍 Lost Items' : type === 'found' ? '📦 Found Items' : '📋 All Listings'}
          </h1>
          <p className="page-subtitle">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filters-inner">
          <div className="search-wrap">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setParam('search', e.target.value)}
            />
          </div>

          <div className="type-toggle">
            <button
              className={`type-btn ${type === '' ? 'active-found' : ''}`}
              onClick={() => setParam('type', '')}
            >All</button>
            <button
              className={`type-btn ${type === 'lost' ? 'active-lost' : ''}`}
              onClick={() => setParam('type', 'lost')}
            >Lost</button>
            <button
              className={`type-btn ${type === 'found' ? 'active-found' : ''}`}
              onClick={() => setParam('type', 'found')}
            >Found</button>
          </div>

          <select
            className="filter-select"
            value={category}
            onChange={e => setParam('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c || 'All Categories'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="listings-container">
        {loading ? (
          <div className="loading">
            <div className="spinner" />LOADING...
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No listings found</h3>
            <p>Try adjusting your filters or <Link to="/new">report a new item</Link>.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map(item => (
              <Link to={`/listings/${item.id}`} key={item.id} className="card">
                {item.image_path
                  ? <img
                      className="card-image"
                      src={`http://localhost:3001/uploads/${item.image_path}`}
                      alt={item.title}
                    />
                  : <div className="card-image-placeholder">
                      {CATEGORY_EMOJI[item.category] || '📦'}
                    </div>
                }
                <div className="card-body">
                  <div className="card-meta">
                    <span className={`badge badge-${item.type}`}>{item.type}</span>
                    <span className="card-cat">{item.category}</span>
                  </div>
                  <h2 className="card-title">{item.title}</h2>
                  {item.description && (
                    <p className="card-desc">{item.description}</p>
                  )}
                  <div className="card-footer">
                    <span>📍 {item.location}</span>
                    <span>📅 {formatDate(item.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
