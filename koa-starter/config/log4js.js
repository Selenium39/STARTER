'use strict';

const path = require('path');
const rootDir = path.join(__dirname, '..');

const isDev = process.env.NODE_ENV && (process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'development');

module.exports = exports = {
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%z] [%c] [%p] %m',
      },
    },
    app: {
      type: 'file',
      filename: path.join(rootDir, 'logs', 'app.log'),
      maxLogSize: 1024 * 1024,
      numBackups: 10,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%z] [%c] [%p] %m',
      },
    },
    errorFile: {
      type: 'file',
      filename: path.join(rootDir, 'logs', 'error.log'),
      maxLogSize: 1024 * 1024,
      numBackups: 10,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%z] [%c] [%p] %m',
      },
    },
    errors: {
      type: 'logLevelFilter',
      level: 'error',
      appender: 'errorFile',
    },
    access: {
      type: 'dateFile',
      filename: path.join(rootDir, 'logs', 'access', 'access'),
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%z] %m',
      },
    },
    // sql: {
    //   type: 'file',
    //   filename: path.join(rootDir, 'logs', 'sql.log'),
    //   maxLogSize: 1024 * 1024,
    //   numBackups: 1,
    //   layout: {
    //     type: 'pattern',
    //     pattern: '[%d] [%z] [%c] [%p] %m',
    //   },
    // },
  },
  categories: {
    // sql: { appenders: ['console', 'sql'], level: 'info' },
    access: { appenders: ['console', 'access'], level: 'info' },
    default: { appenders: ['console', 'app', 'errors'], level: isDev ? 'debug' : 'info' },
  },
};
