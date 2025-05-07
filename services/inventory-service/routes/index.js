const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const routesPath = path.join(__dirname);

  fs.readdirSync(routesPath).forEach(file => {
    if (!file.endsWith('Routes.js')) return;
    const route = require(path.join(routesPath, file));
    const routeName = file.replace('Routes.js', '').toLowerCase();
    app.use(`/${routeName}`, route);
  });
};
