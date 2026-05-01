require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const userRoutes = require('./routes/users');
const auditRoutes = require('./routes/audit');

const app = express();

// CORS configuration – allow multiple origins from comma‑separated list
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['*'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Optional: root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Uganda SafeVoice API is running', status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
