const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { initDB } = require('./database/db');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
// Configure CORS dynamically to allow local development, local Docker, and Azure production origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:8080'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Task Manager API is running 🚀', timestamp: new Date().toISOString() });
});

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────────
const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`\n🚀  Server running on http://localhost:${PORT}`);
    console.log(`📋  API Docs:   http://localhost:${PORT}/api/health\n`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
