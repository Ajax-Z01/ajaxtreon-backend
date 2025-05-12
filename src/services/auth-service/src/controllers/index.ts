import fs from 'fs';

const controllers: Record<string, any> = {};

fs.readdirSync(__dirname).forEach((file: string) => {
  if (file !== 'index.ts' && file.endsWith('.ts')) {
    const controllerName = file.replace('.ts', '');
    controllers[controllerName] = require(`./${file}`);
  }
});

export default controllers;
