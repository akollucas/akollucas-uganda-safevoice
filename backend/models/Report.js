const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.STRING, primaryKey: true }, // e.g., C123456
  accessCode: { type: DataTypes.STRING, allowNull: false }, // 6-digit code for victim login
  type: DataTypes.STRING,
  displayType: DataTypes.STRING,
  description: { type: DataTypes.TEXT, allowNull: false },
  district: DataTypes.STRING,
  subcounty: DataTypes.STRING,
  parish: DataTypes.STRING,
  village: DataTypes.STRING,
  currentLocation: DataTypes.STRING,
  victimName: DataTypes.STRING,
  victimContact: DataTypes.STRING,
  nextKin: DataTypes.STRING,
  policeStation: DataTypes.STRING,
  status: { type: DataTypes.ENUM('pending','assigned','dispatched','investigating','in_court','victim_remanded','victim_convicted_imprison','resolved'), defaultValue: 'pending' },
  evidence: { type: DataTypes.JSON, defaultValue: [] },
  assignedVolunteerId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } },
  assignedOfficerId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } }
}, {
  timestamps: true
});

module.exports = Report;