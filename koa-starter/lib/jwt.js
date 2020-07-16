'use strict';

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid-v4');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

class Jwt {
  constructor(option, redis, logger) {
    this.key = option.key;
    this.expire = option.expire;
    this.redis = redis;
    this.logger = logger;
  }

  async createToken(payload) {
    const tokenId = uuidv4();
    const token = await sign(payload, this.key);
    this.redis.set(tokenId, token, this.expire);
    return tokenId;
  }

  updateToken(tokenId) {
    if (tokenId) {
      this.redis.expire(tokenId, this.expire);
    }
  }

  removeToken(tokenId) {
    if (tokenId) {
      this.redis.del(tokenId);
    }
  }

  async getPayload(tokenId) {
    let token = null;
    if (tokenId) {
      token = await this.redis.get(tokenId);
    }
    if (token === null) {
      throw new Error(`token invalid or expired: ${tokenId}`);
    }
    const payload = await verify(token, this.key);
    this.updateToken(tokenId);
    // this.logger.debug({ tokenId, token, payload });
    return payload;
  }
}

module.exports = exports = Jwt;
