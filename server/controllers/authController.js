const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_lf_secret_key';

// POST /api/auth/register
exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing)
    return res.status(409).json({ error: 'Username already taken' });

  const hashed = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  db.prepare("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, 'user')")
    .run(id, username, hashed);

  res.status(201).json({ message: 'Account created. You can now log in.' });
};

// POST /api/auth/login
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};
