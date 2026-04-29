// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./db');
const User = require('./models/User');
const Report = require('./models/Report');
const Message = require('./models/Message');
const AuditLog = require('./models/AuditLog');

// Associations
Report.hasMany(Message, { foreignKey: 'reportId' });
Message.belongsTo(Report, { foreignKey: 'reportId' });
User.hasMany(Report, { foreignKey: 'assignedVolunteerId' });
User.hasMany(Report, { foreignKey: 'assignedOfficerId' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/stats', require('./routes/stats'));

// Socket.IO
io.on('connection', (socket) => {
  socket.on('joinCase', (caseId) => {
    socket.join(`case_${caseId}`);
  });
  socket.on('sendMessage', async (data) => {
    const { reportId, from, text, userId } = data;
    const message = await Message.create({ reportId, from, text, readBy: [userId] });
    io.to(`case_${reportId}`).emit('newMessage', message);
    socket.broadcast.emit('messageNotification', { reportId, from });
  });
});

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});