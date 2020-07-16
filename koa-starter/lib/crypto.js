'use strict';

const crypto = require('crypto');
const util = require('util');
const pbkdf2 = util.promisify(crypto.pbkdf2);
const randomBytes = util.promisify(crypto.randomBytes);

class Crypto {
  /**
   * 构造函数
   */
  constructor(logger) {
    this.logger = logger;
    this.iterations = 1000;
    this.keylen = 64;
    this.digest = 'sha256';
  }

  /**
   * 生成随机盐值
   * @return {Promise<string>} 返回随机盐值
   */
  async createSalt() {
    const salt = await randomBytes(this.keylen);
    return salt.toString('hex');
  }

  /**
   * 生成哈希值
   * @param {string} str 待加密字符串
   * @param {string} salt 随机盐值
   * @return {Promise<string>} 返回哈希值
   */
  async createHash(str, salt) {
    const hash = await pbkdf2(str, salt, this.iterations, this.keylen, this.digest);
    return hash.toString('hex');
  }

  /**
   * 生成密码对象
   * @param {string} str 待加密密码
   * @return {Promise<lib.crypto_password>} 返回密码对象
   */
  async createPassword(str) {
    const salt = await this.createSalt();
    const hash = await this.createHash(str, salt);
    return { salt, password: hash, pw: str };
  }

  /**
   * 验证密码
   * @param {string} str 待验证密码
   * @param {string} salt 随机盐值
   * @param {string} hash 哈希值
   * @return {Promise<boolean>} 返回密码验证结果
   */
  async verifyPassword(str, salt, hash) {
    const password = await this.createHash(str, salt);
    return password === hash;
  }

  /**
   * 生成随机密码对象
   * @param {number} [len=6] 密码长度
   * @return {Promise<lib.crypto_password>} 返回密码对象
   */
  async randomPassword(len = 6) {
    const str = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
    let pw = '';
    for (let i = 0; i < len; i++) {
      pw += str[Math.floor(Math.random() * str.length)];
    }
    const password = await this.createPassword(pw);
    return password;
  }
}

module.exports = exports = Crypto;
