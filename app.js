const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('module-alias/register');

const authService = require('./services/auth');
const userService = require('./services/user');
const inventoryService = require('./services/inventory');
const paymentService = require('./services/payment');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Ajaxtreon API Gateway is running 🚀');
});

app.use('/auth', authService);
app.use('/user', userService);
app.use('/inventory', inventoryService);
app.use('/payment', paymentService);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
