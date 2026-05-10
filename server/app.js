const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingsRoutes'));

// Global error handler — catches multer errors too
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image too large. Max size is 5MB.' });
  }
  if (err.message === 'Invalid file type') {
    return res.status(400).json({ error: 'Only JPEG, PNG and WebP images are allowed.' });
  }
  res.status(500).json({ error: err.message || 'Something went wrong.' });
});

module.exports = app;
