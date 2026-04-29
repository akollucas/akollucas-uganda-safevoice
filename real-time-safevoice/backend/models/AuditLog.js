const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AuditLog = sequelize.define('AuditLog', {
  action: DataTypes.TEXT,
  userId: DataTypes.STRING,
  username: DataTypes.STRING,
  timestamp: DataTypes.DATE
});

module.exports = AuditLog;