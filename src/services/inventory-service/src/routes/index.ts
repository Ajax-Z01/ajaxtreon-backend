import fs from 'fs';
import path from 'path';
import { Router } from 'express';

export default (router: Router): void => {
  const routesPath = __dirname;

  fs.readdirSync(routesPath).forEach((file) => {
    if (!file.endsWith('Routes.ts')) return;

    const route = require(path.join(routesPath, file)).default;
    const routeName = file.replace(/Routes\.(ts|js)$/, '').toLowerCase();
    router.use(`/${routeName}`, route);
  });
};
