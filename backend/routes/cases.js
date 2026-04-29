const express = require('express');
const { pool } = require('../db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get all cases (with role‑based filtering)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT * FROM reports';
    const params = [];
    if (req.user.role === 'policeOfficer') {
      query += ' WHERE assigned_officer = $1';
      params.push(req.user.id);
    } else if (req.user.role === 'volunteer') {
      query += ' WHERE assigned_volunteer = $1';
      params.push(req.user.id);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new case (public, no auth)
router.post('/', async (req, res) => {
  const { id, accessCode, displayType, description, district, subcounty, parish, village, currentLocation, victimName, victimContact, nextKin, policeStation } = req.body;
  try {
    await pool.query(`INSERT INTO reports (id, access_code, display_type, description, district, subcounty, parish, village, current_location, victim_name, victim_contact, next_kin, police_station, status, evidence, messages) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    [id, accessCode, displayType, description, district, subcounty, parish, village, currentLocation, victimName, victimContact, nextKin, policeStation, 'pending', '[]', '[]']);
    res.status(201).json({ message: 'Case created', caseId: id, accessCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update case
router.put('/:id', authenticate, async (req, res) => {
  const { status, assignedVolunteer, assignedOfficer, archive, resolvedDate, messages } = req.body;
  const fields = [];
  const values = [];
  if (status !== undefined) { fields.push(`status = $${fields.length+1}`); values.push(status); }
  if (assignedVolunteer !== undefined) { fields.push(`assigned_volunteer = $${fields.length+1}`); values.push(assignedVolunteer); }
  if (assignedOfficer !== undefined) { fields.push(`assigned_officer = $${fields.length+1}`); values.push(assignedOfficer); }
  if (archive !== undefined) { fields.push(`archive = $${fields.length+1}`); values.push(archive); }
  if (resolvedDate !== undefined) { fields.push(`resolved_date = $${fields.length+1}`); values.push(resolvedDate); }
  if (messages !== undefined) { fields.push(`messages = $${fields.length+1}`); values.push(JSON.stringify(messages)); }
  values.push(req.params.id);
  try {
    await pool.query(`UPDATE reports SET ${fields.join(',')} WHERE id = $${values.length}`, values);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Victim login (no auth)
router.post('/victim-login', async (req, res) => {
  const { caseId, accessCode } = req.body;
  try {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1 AND access_code = $2', [caseId, accessCode]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Case not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;