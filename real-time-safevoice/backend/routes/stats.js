const express = require('express');
const { Sequelize } = require('sequelize');
const Report = require('../models/Report');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/admin', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const total = await Report.count();
  const pending = await Report.count({ where: { status: 'pending' } });
  const assigned = await Report.count({ where: { status: 'assigned' } });
  const dispatched = await Report.count({ where: { status: 'dispatched' } });
  const investigating = await Report.count({ where: { status: 'investigating' } });
  const inCourt = await Report.count({ where: { status: 'in_court' } });
  const remanded = await Report.count({ where: { status: 'victim_remanded' } });
  const convicted = await Report.count({ where: { status: 'victim_convicted_imprison' } });
  const resolved = await Report.count({ where: { status: 'resolved' } });

  // Charts data
  const districtData = await Report.findAll({ attributes: ['district', [Sequelize.fn('COUNT', Sequelize.col('district')), 'count']], group: ['district'] });
  const villageData = await Report.findAll({ attributes: ['village', [Sequelize.fn('COUNT', Sequelize.col('village')), 'count']], group: ['village'], limit: 10 });
  const parishData = await Report.findAll({ attributes: ['parish', [Sequelize.fn('COUNT', Sequelize.col('parish')), 'count']], group: ['parish'], limit: 10 });
  const policeStationData = await Report.findAll({ attributes: ['policeStation', [Sequelize.fn('COUNT', Sequelize.col('policeStation')), 'count']], group: ['policeStation'], limit: 10 });

  res.json({
    total, pending, assigned, dispatched, investigating, inCourt, remanded, convicted, resolved,
    districtData, villageData, parishData, policeStationData
  });
});

module.exports = router;