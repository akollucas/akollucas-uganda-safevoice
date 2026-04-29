const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'policeAdmin', 'policeOfficer', 'volunteer'), allowNull: false },
  station: DataTypes.STRING,
  address: DataTypes.STRING,
  shortId: DataTypes.STRING,
  profilePhoto: DataTypes.TEXT,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

User.prototype.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = User;