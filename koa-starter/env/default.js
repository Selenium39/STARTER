'use strict';

const config = {
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
  },
  jwt: {
    key: 'jwt_secret',
    expire: 7200,
  },
};

module.exports = exports = config;
