const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Report = require('../models/Report');
const Message = require('../models/Message');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper: generate caseId (C + timestamp) and 6‑digit access code
function generateCaseId() { return 'C' + Date.now().toString().slice(-6); }
function generateAccessCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }

// ------------------------------------------------------------
// Anonymous report submission (no auth)
router.post('/', upload.array('evidence', 5), async (req, res) => {
  try {
    let { type, displayType, description, district, subcounty, parish, village, currentLocation,
          victimName, victimContact, nextKin, policeStation } = req.body;
    if (!description || !district) return res.status(400).json({ error: 'Description and district required' });
    victimContact = victimContact || 'anonymous';
    const caseId = generateCaseId();
    const accessCode = generateAccessCode();
    const evidenceUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'safevoice_evidence' });
        evidenceUrls.push(result.secure_url);
      }
    }
    const report = await Report.create({
      id: caseId, accessCode, type, displayType, description, district, subcounty, parish, village,
      currentLocation, victimName: victimName || 'anonymous', victimContact, nextKin, policeStation,
      status: 'pending', evidence: evidenceUrls
    });
    await AuditLog.create({ action: `New report ${caseId} submitted (type: ${displayType})`, userId: 'public', username: 'victim', timestamp: new Date() });
    res.status(201).json({ caseId, accessCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports (role‑based)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'policeOfficer') {
      where.assignedOfficerId = req.user.id;
    } else if (req.user.role === 'volunteer') {
      where.assignedVolunteerId = req.user.id;
    } else if (req.user.role === 'policeAdmin') {
      // see all
    } else if (req.user.role === 'admin') {
      // see all
    }
    if (req.query.status) where.status = req.query.status;
    const reports = await Report.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update report status, assignment, etc.
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    const { status, assignedVolunteerId, assignedOfficerId } = req.body;
    let msg = '';
    if (status && status !== report.status) {
      report.status = status;
      msg = `Status changed to ${status}`;
    }
    if (assignedVolunteerId !== undefined && assignedVolunteerId !== report.assignedVolunteerId) {
      report.assignedVolunteerId = assignedVolunteerId;
      if (assignedVolunteerId) msg = `Assigned to CPV ${assignedVolunteerId}`;
      else msg = 'Unassigned from CPV';
    }
    if (assignedOfficerId !== undefined && assignedOfficerId !== report.assignedOfficerId) {
      report.assignedOfficerId = assignedOfficerId;
      if (assignedOfficerId) msg = `Assigned to officer ${assignedOfficerId}`;
      else msg = 'Unassigned from officer';
    }
    await report.save();
    if (msg) {
      await AuditLog.create({ action: `Case ${report.id}: ${msg}`, userId: req.user.id, username: req.user.username, timestamp: new Date() });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Victim access (no auth, uses caseId + accessCode)
router.get('/victim/:caseId/:accessCode', async (req, res) => {
  const report = await Report.findOne({ where: { id: req.params.caseId, accessCode: req.params.accessCode } });
  if (!report) return res.status(404).json({ error: 'Not found' });
  res.json(report);
});

module.exports = router;