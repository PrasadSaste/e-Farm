require('dotenv').config({ path: __dirname + '/.env' });

console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const dotenv      = require('dotenv');
const connectDB   = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Security & Middleware ─────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/crops',   require('./routes/cropRoutes'));
app.use('/api/market',  require('./routes/marketRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', uptime: process.uptime() })
);

// ── Global Error Handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 E-FARM server running on http://localhost:${PORT}`)
);

module.exports = app;
