import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createListing } from '../api/listings'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Keys', 'Wallet', 'ID/Card', 'Bag', 'Other']

const INITIAL = {
  type: 'lost', title: '', description: '', category: '',
  location: '', date: '', image: null
}

export default function NewListing() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.location || !form.date) {
      return showToast('Please fill in all required fields.', 'error')
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('type', form.type)
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('location', form.location)
      fd.append('date', form.date)
      if (form.image) fd.append('image', form.image)

      const res = await createListing(fd)
      showToast('Listing created successfully!')
      setTimeout(() => navigate(`/listings/${res.data.id}`), 1200)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="form-container">
      <Link to="/listings" className="back-link" style={{marginTop:'2rem', display:'inline-flex'}}>← Back to listings</Link>

      <div className="form-card">
        <h1 className="form-title">Report an Item</h1>
        <p className="form-subtitle">Fill in the details below to create a listing.</p>

        <form onSubmit={handleSubmit}>
          {/* Type */}
          <div className="form-group">
            <label>I am reporting a... *</label>
            <div className="type-selector">
              <div
                className={`type-option lost ${form.type === 'lost' ? 'selected' : ''}`}
                onClick={() => set('type', 'lost')}
              >🔍 Lost Item</div>
              <div
                className={`type-option found ${form.type === 'found' ? 'selected' : ''}`}
                onClick={() => set('type', 'found')}
              >📦 Found Item</div>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              placeholder="e.g. Blue Hydro Flask, MacBook Pro, Student ID..."
              value={form.title}
              onChange={e => set('title', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Category + Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                placeholder="e.g. Library 2nd floor, Dining Hall..."
                value={form.location}
                onChange={e => set('location', e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date {form.type === 'lost' ? 'Lost' : 'Found'} *</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe the item — color, brand, any identifying features..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Photo (optional)</label>
            <div className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={e => set('image', e.target.files[0])}
              />
              <div className="file-upload-icon">📷</div>
              <p>Click to upload a photo of the item</p>
              {form.image && <p className="file-upload-name">✓ {form.image.name}</p>}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/listings" className="btn btn-secondary btn-full" style={{justifyContent:'center'}}>
              Cancel
            </Link>
            <button
              type="submit"
              className={`btn btn-full ${form.type === 'found' ? 'btn-sage' : 'btn-primary'}`}
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting...' : `✓ Submit ${form.type === 'lost' ? 'Lost' : 'Found'} Report`}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  )
}
