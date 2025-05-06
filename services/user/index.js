const express = require('express');
const router = express.Router();

require('./routes')(router);

module.exports = router;
