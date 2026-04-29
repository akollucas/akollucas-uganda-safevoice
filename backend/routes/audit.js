const express = require('express');
const { pool } = require('../db');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all audit logs (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  const result = await pool.query('SELECT * FROM audit ORDER BY id DESC');
  res.json(result.rows);
});

// Add audit log (internal)
router.post('/', async (req, res) => {
  const { action, userId, username } = req.body;
  await pool.query('INSERT INTO audit (action, user_id, username, timestamp) VALUES ($1,$2,$3,$4)',
    [action, userId, username, new Date().toLocaleString()]);
  res.status(201).json({ message: 'Logged' });
});

module.exports = router;