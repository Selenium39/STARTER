'use strict';

const { promisify } = require('util');
const redis = require('redis');

class Redis {
  constructor(option, logger) {
    this.logger = logger;
    this.client = redis.createClient({
      host: option.host,
      port: option.port,
      password: option.password,
      db: option.db,
    });
    this.client.on('ready', () => {
      this.logger.info('[Redis] ready');
    });
    this.client.on('connect', () => {
      // this.logger.debug('[Redis] connect');
    });
    this.client.on('reconnecting', () => {
      this.logger.debug('[Redis] reconnecting');
    });
    this.client.on('end', () => {
      this.logger.debug('[Redis] end');
    });
    this.client.on('warning', msg => {
      this.logger.warn('[Redis] warning:', msg);
    });
    this.client.on('error', err => {
      this.logger.error('[Redis] warning:', err.toString());
    });
  }

  async incr(key) {
    if (!(key && typeof key === 'string')) {
      throw new Error(`invalid key: ${key}[${typeof key}]`);
    }
    const result = await promisify(this.client.incr).bind(this.client)(key);
    return result;
  }

  async get(key) {
    if (!(key && typeof key === 'string')) {
      throw new Error(`invalid key: ${key}[${typeof key}]`);
    }
    const result = await promisify(this.client.get).bind(this.client)(key);
    return result;
  }

  set(key, value, second) {
    if (!(key && typeof key === 'string')) {
      throw new Error(`invalid key: ${key}[${typeof key}]`);
    }
    if (second !== undefined) {
      this.client.set(key, value, 'EX', second);
    } else {
      this.client.set(key, value);
    }
  }

  // async hgetall(key) {
  //   if (!(key && typeof key === 'string')) {
  //     throw new Error(`invalid key: ${key}[${typeof key}]`);
  //   }
  //   const result = await promisify(this.client.hgetall).bind(this.client)(key);
  //   return result;
  // }

  // async hget(key, field) {
  //   if (!(key && typeof key === 'string')) {
  //     throw new Error(`invalid key: ${key}[${typeof key}]`);
  //   }
  //   if (!(field && typeof field === 'string' || typeof field === 'number')) {
  //     throw new Error(`invalid field: ${field}[${typeof field}]`);
  //   }
  //   return await promisify(this.client.hget).bind(this.client)(key, field.toString());
  // }

  // hmset(key, obj, second) {
  //   if (!(key && typeof key === 'string')) {
  //     throw new Error(`invalid key: ${key}[${typeof key}]`);
  //   }
  //   if (!(obj && typeof obj === 'object')) {
  //     throw new Error(`invalid obj: ${obj}[${typeof obj}]`);
  //   }
  //   this.client.hmset(key, obj);
  //   if (second !== undefined) {
  //     this.client.expire(key, second);
  //   }
  // }

  expire(key, second) {
    if (!(key && typeof key === 'string')) {
      throw new Error(`invalid key: ${key}[${typeof key}]`);
    }
    this.client.expire(key, second);
  }

  del(key) {
    if (!(key && typeof key === 'string')) {
      throw new Error(`invalid key: ${key}[${typeof key}]`);
    }
    this.client.del(key);
  }

  async cmd(cmd, ...argvs) {
    const result = await promisify(this.client[cmd]).bind(this.client)(...argvs);
    return result;
  }
}

module.exports = exports = Redis;
