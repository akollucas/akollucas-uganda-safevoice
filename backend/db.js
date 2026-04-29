const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use DATABASE_URL from environment (Render provides it)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false   // Required for Render PostgreSQL
    }
  }
});

module.exports = sequelize;
