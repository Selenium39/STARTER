'use strict';

const isDev = process.env.NODE_ENV && (process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'development');

const cluster = require('cluster');
// const numCPUs = isDev ? 1 : require('os').cpus().length;
const numCPUs = 1;
const log4js = require('log4js');

log4js.configure(require('./config/log4js'));

const logger = log4js.getLogger('master');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      NODE_ENV: isDev ? 'dev' : 'prod',
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info('worker %d died (%s). restarting...', worker.process.pid, signal || code);
    cluster.fork({
      NODE_ENV: isDev ? 'dev' : 'prod',
    });
  });

  logger.info(`Master ${process.pid} is running`);
} else {
  require('./app');
}
