const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Staff login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ where: { username, role, isActive: true } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role, profilePhoto: user.profilePhoto } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Victim login (caseId + accessCode)
router.post('/victim-login', async (req, res) => {
  const { caseId, accessCode } = req.body;
  const report = await Report.findOne({ where: { id: caseId, accessCode } });
  if (!report) return res.status(401).json({ error: 'Invalid case ID or access code' });
  res.json({ reportId: report.id, victimName: report.victimName, status: report.status });
});

// Get current user (for token validation)
router.get('/me', authMiddleware, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, fullName: req.user.fullName, role: req.user.role, profilePhoto: req.user.profilePhoto });
});

// Register new staff (admin only)
router.post('/register', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { username, password, fullName, role, station, address, badge, phone, district } = req.body;
    if (!['policeOfficer', 'volunteer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username exists' });
    let shortId = null;
    if (role === 'policeOfficer') {
      const officers = await User.findAll({ where: { role: 'policeOfficer' } });
      shortId = generateShortId(fullName, officers);
    }
    const user = await User.create({
      username, password, fullName, role,
      station: station || null,
      address: address || null,
      shortId,
      badge: badge || null,
      phone: phone || null,
      district: district || null
    });
    await AuditLog.create({ action: `Registered new ${role}: ${username}`, userId: req.user.id, username: req.user.username, timestamp: new Date() });
    res.json({ message: 'User registered', user: { id: user.id, username, fullName, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateShortId(fullName, existingOfficers) {
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  let base = initials.slice(0, 3);
  if (base.length < 2) base = initials + 'X';
  let num = 1;
  let newId;
  do {
    newId = base + String(num).padStart(3, '0');
    num++;
  } while (existingOfficers.some(o => o.shortId === newId));
  return newId;
}

module.exports = router;