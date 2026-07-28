const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas Cluster
connectDB();

const app = express();

// ─── Global Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger ──────────────────────────────────────────────────
app.use((req, res, next) => {
  res.on('finish', () => {
    const status = res.statusCode;
    if (status >= 200 && status < 300) {
      console.log(`✅ [SUCCESS] ${req.method} ${req.originalUrl} - Status: ${status}`);
    } else {
      console.log(`❌ [ERROR] ${req.method} ${req.originalUrl} - Status: ${status}`);
    }
  });
  next();
});

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CRM Backend is running', timestamp: new Date().toISOString() });
});

// ─── Service Routes ──────────────────────────────────────────────────
app.use('/api/auth',          require('./services/auth/auth.routes'));
app.use('/api/dashboard',     require('./services/dashboard/dashboard.routes'));
app.use('/api/leads',         require('./services/leads/leads.routes'));
app.use('/api/lead-upload',   require('./services/lead-upload/leadUpload.routes'));
app.use('/api/calling',       require('./services/calling/calling.routes'));
app.use('/api/targets',       require('./services/targets/targets.routes'));
app.use('/api/configuration', require('./services/configuration/configuration.routes'));
app.use('/api/reports',       require('./services/reports/reports.routes'));
app.use('/api/noticeboard',   require('./services/noticeboard/noticeboard.routes'));
app.use('/api/mailing',       require('./services/internal-mailing/mailing.routes'));
app.use('/api/mail',          require('./services/mail/mail.routes'));
app.use('/api/chatting',      require('./services/chatting/chatting.routes'));
app.use('/api/profile',       require('./services/profile/profile.routes'));

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 CRM Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);

});

module.exports = app;
