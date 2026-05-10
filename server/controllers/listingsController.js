const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists on startup
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads/ folder');
}

exports.getAllListings = (req, res) => {
  const { type, category, search } = req.query;
  let query = 'SELECT * FROM listings WHERE 1=1';
  const params = [];
  if (type)     { query += ' AND type = ?';                            params.push(type); }
  if (category) { query += ' AND category = ?';                        params.push(category); }
  if (search)   { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
};

exports.createListing = (req, res) => {
  try {
    const { type, title, description, category, location, date } = req.body;
    if (!type || !title || !category || !location || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const image_path = req.file ? req.file.filename : null;

    // Run python image processing in background — use 'python' on Windows, 'python3' on Mac/Linux
    if (req.file) {
      const fullPath = path.join(uploadsDir, image_path);
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const scriptPath = path.join(__dirname, '..', 'python', 'process_image.py');

      // Only run if the python script actually exists
      if (fs.existsSync(scriptPath)) {
        execFile(pythonCmd, [scriptPath, fullPath], (err) => {
          if (err) console.warn('Image processing skipped:', err.message);
        });
      }
    }

    db.prepare(`INSERT INTO listings VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
      .run(id, type, title, description || '', category, location, date, image_path);

    res.status(201).json({ id, message: 'Listing created' });
  } catch (err) {
    console.error('createListing error:', err.message);
    res.status(500).json({ error: 'Failed to create listing. Please try again.' });
  }
};

exports.getListingById = (req, res) => {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
  listing ? res.json(listing) : res.status(404).json({ error: 'Not found' });
};

exports.deleteListing = (req, res) => {
  // Also delete the image file if it exists
  const listing = db.prepare('SELECT image_path FROM listings WHERE id = ?').get(req.params.id);
  if (listing?.image_path) {
    const imgPath = path.join(uploadsDir, listing.image_path);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  db.prepare('DELETE FROM listings WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
};
