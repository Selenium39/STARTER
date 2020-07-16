'use strict';

const path = require('path');

const env = process.env.NODE_ENV && (process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'development')
  ? 'dev'
  : 'prod';

const config = require('./default');
const configEnv = require(`./${env}`);

for (const key in configEnv) {
  if (config[key] === undefined) {
    config[key] = configEnv[key];
  } else {
    if (typeof config[key] === 'object' && typeof configEnv[key] === 'object') {
      Object.assign(config[key], configEnv[key]);
    } else {
      config[key] = configEnv[key];
    }
  }
}
config.uploads = path.join(__dirname, '..', 'uploads');

module.exports = exports = config;
