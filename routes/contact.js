const express = require('express');
const router = express.Router();

module.exports = function (db) {
  // Create a new contact
  router.post('/', (req, res) => {
    const { name, email, phone, address } = req.body;
    const stmt = db.prepare("INSERT INTO contacts (name, email, phone, address) VALUES (?, ?, ?, ?)");
    stmt.run(name, email, phone, address, function (err) {
      if (err) {
        res.status(400).json({ message: 'Error creating contact', error: err.message });
      } else {
        res.status(201).json({ message: 'Contact created', contactId: this.lastID });
      }
    });
    stmt.finalize();
  });

  // Get all contacts
  router.get('/', (req, res) => {
    db.all('SELECT * FROM contacts', [], (err, rows) => {
      if (err) {
        res.status(400).json({ message: 'Error fetching contacts', error: err.message });
      } else {
        res.status(200).json(rows);
      }
    });
  });

  // Get a contact by ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(400).json({ message: 'Error fetching contact', error: err.message });
      } else if (row) {
        res.status(200).json(row);
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    });
  });

  // Update a contact by ID
  router.put('/:id', (req, res) => {
    const { name, email, phone, address } = req.body;
    const { id } = req.params;
    const stmt = db.prepare("UPDATE contacts SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?");
    stmt.run(name, email, phone, address, id, function (err) {
      if (err) {
        res.status(400).json({ message: 'Error updating contact', error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: 'Contact not found' });
      } else {
        res.status(200).json({ message: 'Contact updated', contactId: id });
      }
    });
    stmt.finalize();
  });

  // Delete a contact by ID
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM contacts WHERE id = ?");
    stmt.run(id, function (err) {
      if (err) {
        res.status(400).json({ message: 'Error deleting contact', error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: 'Contact not found' });
      } else {
        res.status(200).json({ message: 'Contact deleted' });
      }
    });
    stmt.finalize();
  });

  return router;
};

