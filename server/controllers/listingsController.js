const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const { execFile } = require('child_process');
const path = require('path');

exports.getAllListings = (req, res) => {
  const { type, category, search } = req.query;
  let query = 'SELECT * FROM listings WHERE 1=1';
  const params = [];
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
};

exports.createListing = (req, res) => {
  const { type, title, description, category, location, date } = req.body;
  if (!type || !title || !category || !location || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = uuidv4();
  const image_path = req.file ? req.file.filename : null;

  if (req.file) {
    const fullPath = path.join(__dirname, '..', 'uploads', image_path);
    execFile('python3', [path.join(__dirname, '..', 'python', 'process_image.py'), fullPath], (err) => {
      if (err) console.error('Image processing error:', err.message);
    });
  }

  db.prepare(`INSERT INTO listings VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
    .run(id, type, title, description || '', category, location, date, image_path);
  res.status(201).json({ id, message: 'Listing created' });
};

exports.getListingById = (req, res) => {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
  listing ? res.json(listing) : res.status(404).json({ error: 'Not found' });
};

exports.deleteListing = (req, res) => {
  db.prepare('DELETE FROM listings WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
};