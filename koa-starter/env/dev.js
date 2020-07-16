'use strict';

const dev = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'test',
    logging: false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: '123456',
    db: 0,
  }
};

module.exports = exports = dev;
