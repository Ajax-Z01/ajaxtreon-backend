const fs = require('fs');
const path = require('path');

const controllers = {};

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const controllerName = file.replace('.js', '');
    controllers[controllerName] = require(`./${file}`);
  }
});

module.exports = controllers;
