require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('short'));
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
  }),
);

app.use(express.static(path.join(__dirname)));

app.post('/api/discovery-contact', (req, res) => {
  const { name, email, goal, timeline, message } = req.body;

  if (!name || !email || !goal || !timeline || !message) {
    return res.status(400).json({ error: 'All discovery contact fields are required.' });
  }

  return res.status(201).json({ message: 'Discovery contact submitted successfully.' });
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  return res.status(201).json({ message: 'Subscription successful.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

server.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});

module.exports = app;
