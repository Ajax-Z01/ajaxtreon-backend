const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Inventory Management System API is running');
});

require('./routes')(router);

module.exports = router;