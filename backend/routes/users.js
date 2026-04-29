const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  const result = await pool.query('SELECT id, username, full_name, role, contact, station, district, parish, village, dob, registration_date, short_id FROM users');
  res.json(result.rows);
});

// Register new user (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  const { id, username, password, fullName, role, contact, station, district, parish, village, dob, registrationDate, shortId } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO users (id, username, password, full_name, role, contact, station, district, parish, village, dob, registration_date, short_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [id, username, hashed, fullName, role, contact, station, district, parish, village, dob, registrationDate, shortId]);
  res.status(201).json({ message: 'User created' });
});

// Update user profile (admin only for now)
router.put('/:id', authenticateAdmin, async (req, res) => {
  const { fullName, contact, profilePhoto, password } = req.body;
  let query = 'UPDATE users SET full_name = $1, contact = $2';
  let values = [fullName, contact];
  if (profilePhoto) { query += `, profile_photo = $${values.length+1}`; values.push(profilePhoto); }
  if (password) { const hashed = await bcrypt.hash(password, 10); query += `, password = $${values.length+1}`; values.push(hashed); }
  values.push(req.params.id);
  await pool.query(query + ' WHERE id = $' + values.length, values);
  res.json({ message: 'Updated' });
});

// Delete user (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;