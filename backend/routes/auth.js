const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND role = $2', [username, role]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, fullName: user.full_name, role: user.role, contact: user.contact, profilePhoto: user.profile_photo } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;