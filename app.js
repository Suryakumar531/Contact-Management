const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contacts');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SQLite Database connection
const db = new sqlite3.Database('./database/contacts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create contacts table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      address TEXT
    )
  `);
});

// Use routes
app.use('/api/contacts', contactRoutes(db));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
