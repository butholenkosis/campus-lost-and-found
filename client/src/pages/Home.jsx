import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getListings } from '../api/listings'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Keys', 'Wallet', 'ID/Card', 'Bag', 'Other']

export default function Home() {
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0 })

  useEffect(() => {
    getListings().then(res => {
      const all = res.data
      setStats({
        total: all.length,
        lost: all.filter(l => l.type === 'lost').length,
        found: all.filter(l => l.type === 'found').length,
      })
    }).catch(() => {})
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-tag">Campus Lost & Found</div>
          <h1 className="hero-title">
            Lost something?<br />
            <em>We'll help you find it.</em>
          </h1>
          <p className="hero-subtitle">
            A simple platform for students to report lost items and help reunite classmates with their belongings.
          </p>
          <div className="hero-actions">
            <Link to="/listings?type=lost" className="btn btn-primary">🔍 Browse Lost Items</Link>
            <Link to="/listings?type=found" className="btn btn-secondary">📦 See Found Items</Link>
            <Link to="/new" className="btn btn-sage">+ Report an Item</Link>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Total Listings</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.lost}</span>
          <span className="stat-label">Lost Reports</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.found}</span>
          <span className="stat-label">Found Items</span>
        </div>
      </div>

      <section className="how-section">
        <p className="section-label">How it works</p>
        <h2 className="section-title">Simple steps to reconnect</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Report</h3>
            <p>Submit a listing for something you've lost or found on campus with key details.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Browse</h3>
            <p>Search through listings by category, location, or date to find your item.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Connect</h3>
            <p>Reach out through campus channels to arrange a safe handoff.</p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <h3>Reunited</h3>
            <p>Get your item back (or help someone else get theirs) and make someone's day!</p>
          </div>
        </div>
      </section>
    </>
  )
}
