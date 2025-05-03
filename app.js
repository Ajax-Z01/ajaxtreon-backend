const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('module-alias/register');

const authService = require('./services/auth');
const userService = require('./services/user');
const inventoryService = require('./services/inventory');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Ajaxtreon API Gateway is running 🚀');
});

app.use('/auth', authService);
app.use('/users', userService);
app.use('/inventory', inventoryService);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
