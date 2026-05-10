const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('lostandfound.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    image_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed the admin account if it doesn't exist yet
const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  const { v4: uuidv4 } = require('uuid');
  const hashed = bcrypt.hashSync('admin123', 10); // Change this password!
  db.prepare("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, 'admin')")
    .run(uuidv4(), 'admin', hashed);
  console.log('✅ Admin account created: username=admin, password=admin123');
}

module.exports = db;
