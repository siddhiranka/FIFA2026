require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { apiLimiter, aiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const aiRoutes = require('./routes/ai');
const crowdRoutes = require('./routes/crowd');
const incidentRoutes = require('./routes/incidents');
const transportRoutes = require('./routes/transport');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'StadiumPulse AI API',
    version: '1.0.0',
    timestamp: new Date(),
    diagnostics: {
      geminiApiKeyLoaded: !!process.env.GEMINI_API_KEY,
      geminiApiKeyStart: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 7)}...` : 'not-found',
      mongodbUriLoaded: !!process.env.MONGODB_URI,
      jwtSecretLoaded: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV || 'not-set'
    }
  });
});

// Routes
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/transport', transportRoutes);

// Error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚽ StadiumPulse AI Server running on port ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
