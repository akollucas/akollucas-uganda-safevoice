const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      contact TEXT,
      profile_photo TEXT,
      station TEXT,
      district TEXT,
      parish TEXT,
      village TEXT,
      dob TEXT,
      registration_date TEXT,
      short_id TEXT
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      access_code TEXT NOT NULL,
      display_type TEXT NOT NULL,
      description TEXT,
      district TEXT,
      subcounty TEXT,
      parish TEXT,
      village TEXT,
      current_location TEXT,
      victim_name TEXT,
      victim_contact TEXT,
      next_kin TEXT,
      police_station TEXT,
      status TEXT DEFAULT 'pending',
      assigned_volunteer TEXT,
      assigned_officer TEXT,
      evidence JSONB DEFAULT '[]',
      messages JSONB DEFAULT '[]',
      archive BOOLEAN DEFAULT FALSE,
      resolved_date TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit (
      id SERIAL PRIMARY KEY,
      action TEXT,
      user_id TEXT,
      username TEXT,
      timestamp TEXT
    );
  `);
  console.log('Database tables ready');
};

module.exports = { pool, initDB };