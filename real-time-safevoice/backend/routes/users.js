const express = require('express');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
});

// Update user (admin or self)
router.put('/:id', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.user.role !== 'admin' && req.user.id !== user.id) return res.status(403).json({ error: 'Forbidden' });
  const { fullName, password, station, address, badge, phone, district, profilePhoto } = req.body;
  if (fullName) user.fullName = fullName;
  if (password) user.password = password;
  if (station) user.station = station;
  if (address) user.address = address;
  if (badge) user.badge = badge;
  if (phone) user.phone = phone;
  if (district) user.district = district;
  if (profilePhoto) user.profilePhoto = profilePhoto;
  await user.save();
  await AuditLog.create({ action: `Updated user ${user.username}`, userId: req.user.id, username: req.user.username, timestamp: new Date() });
  res.json({ message: 'User updated' });
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await user.destroy();
  await AuditLog.create({ action: `Deleted user ${user.username}`, userId: req.user.id, username: req.user.username, timestamp: new Date() });
  res.json({ message: 'User deleted' });
});

module.exports = router;