const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const projectRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/projects', projectRoutes);

// Serve the frontend for any non-API route
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
