const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reportId: { type: DataTypes.STRING, allowNull: false, references: { model: 'Reports', key: 'id' } },
  from: DataTypes.STRING,
  text: DataTypes.TEXT,
  readBy: { type: DataTypes.JSON, defaultValue: [] } // array of user IDs
});

module.exports = Message;