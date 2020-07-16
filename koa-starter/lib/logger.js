'use strict';

const log4js = require('log4js');

const defaultLogger = log4js.getLogger('worker');
const accessLogger = log4js.getLogger('access');
// const sqlLogger = log4js.getLogger('sql');

const logger = defaultLogger;
logger.access = (...params) => {
  accessLogger.info(...params);
};
// logger.sql = (...params) => {
//   sqlLogger.debug(...params);
// };

module.exports = exports = logger;
