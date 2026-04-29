const express = require('express');
const Message = require('../models/Message');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all messages for a report (with read status)
router.get('/:reportId', authMiddleware, async (req, res) => {
  const { reportId } = req.params;
  const report = await Report.findByPk(reportId);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  // Check permission: admin, policeAdmin, assigned officer, assigned volunteer, or victim (not via this route)
  if (req.user.role === 'policeOfficer' && report.assignedOfficerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (req.user.role === 'volunteer' && report.assignedVolunteerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const messages = await Message.findAll({ where: { reportId }, order: [['createdAt', 'ASC']] });
  res.json(messages);
});

// Mark messages as read for current user
router.post('/:reportId/read', authMiddleware, async (req, res) => {
  const { reportId } = req.params;
  const messages = await Message.findAll({ where: { reportId } });
  for (const m of messages) {
    if (!m.readBy.includes(req.user.id)) {
      m.readBy.push(req.user.id);
      await m.save();
    }
  }
  res.json({ success: true });
});

module.exports = router;