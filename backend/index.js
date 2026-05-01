require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const userRoutes = require('./routes/users');
const auditRoutes = require('./routes/audit');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Uganda SafeVoice API is running',
    status: 'ok',
    endpoints: {
      login: 'POST /api/auth/login',
      cases: 'GET /api/cases',
      victims: 'POST /api/cases/victim-login',
      users: 'GET /api/users (admin only)',
      audit: 'GET /api/audit (admin only)'
    }
  });
});
});


