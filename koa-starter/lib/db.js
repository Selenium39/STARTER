'use strict';

const mysql = require('mysql2');

class Db {
  /**
   * 构造函数
   * @param {object} option 配置选项
   * @param {string} option.host 主机名或IP地址
   * @param {number} option.port 端口号
   * @param {string} option.user 用户名
   * @param {string} option.charset 字符集
   * @param {string} option.password 密码
   * @param {string} option.database 数据库名称
   * @param {boolean} [option.logging=false] 是否输出SQL
   */
  constructor(option, logger) {
    this.logger = logger;
    this.pool = mysql.createPool({
      host: option.host,
      port: option.port,
      user: option.user,
      charset: option.charset,
      password: option.password,
      database: option.database,
      dateStrings: true,
      waitForConnections: true,
      
      connectionLimit: 10,
      queueLimit: 0,
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return (field.string() === '1'); // 1 = true, 0 = false
        } else {
          return next();
        }
      },
    }).promise();
    this.pool.query('SELECT 1')
      .then((rows, fields) => {
        this.logger.info('[DB] ready');
        this.pool.on('acquire', connection => {
          this.logger.debug('[DB] Connection %d acquired', connection.threadId);
        });
        this.pool.on('connection', connection => {
          this.logger.debug('[DB] Connection %d connection', connection.threadId);
        });
        this.pool.on('enqueue', () => {
          this.logger.debug('[DB] Waiting for available connection slot');
        });
        this.pool.on('release', connection => {
          this.logger.debug('[DB] Connection %d released', connection.threadId);
        });
        this.logging = option.logging || false;
      }).catch(this.logger.error);
  }

  /**
   * 返回查询结果
   * @param {string} sqlString SQL查询语句
   * @param {string[]} values 变量值数组
   * @return {Promise<object[]>} 返回查询结果数组
   * @ignore
   */
  // async queryPool(sqlString, values) {
  //   if (this.logging) {
  //     this.logger.info(mysql.format(sqlString, values));
  //   }
  //   const [rows, fields] = values ? await this.pool.query(sqlString, values) : await this.pool.query(sqlString); /* eslint-disable-line no-unused-vars */
  //   return rows;
  // }

  /**
   * 从连接池获取连接
   * @return {Promise<object>} 返回数据库连接
   */
  async getConnection() {
    const connection = await this.pool.getConnection();
    return connection;
  }

  /**
   * 释放连接回连接池
   * @param {object} 数据库连接
   */
  releaseConnection(conn) {
    if (conn) {
      conn.release();
    }
  }

  /**
   * 返回查询结果(事务)
   * @param {object} conn 数据库连接
   * @param {string|object} sql SQL查询语句或对象
   * @param {string[]} values 变量值数组
   * @return {Promise<object[]>} 返回查询结果数组
   */
  async query(conn, sql, values) {
    let start, stop, rows,
      fields; /* eslint-disable-line no-unused-vars */
    try {
      start = Date.now();
      // [rows, fields] = values ? await conn.query(sql, values) : await conn.query(sql);
      [rows, fields] = await conn.query(sql, values);
      stop = Date.now();
    } finally {
      if (rows && this.logging) {
        let sqlString = mysql.format(typeof sql === 'object' ? sql.sql : sql, values || sql.values).trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/,\s/g, ',');
        if (sqlString.lastIndexOf(';') !== sqlString.length - 1) {
          sqlString = sqlString + ';';
        }
        const cmd = sqlString.split(' ')[0].toUpperCase();
        let info;
        if (cmd === 'SELECT' || cmd === 'DESC') {
          info = rows
            ? rows.length === 0
              ? `\nEmpty set (${(stop - start) / 1000} sec)`
              : rows.length === 1
                ? `\n1 row in set (${(stop - start) / 1000} sec)`
                : `\n${rows.length} rows in set (${(stop - start) / 1000} sec)`
            : '';
        } else if (cmd === 'INSERT' || cmd === 'UPDATE' || cmd === 'DELETE') {
          info = (rows.changedRows !== undefined ? rows.changedRows : rows.affectedRows) === 1
            ? `\nQuery OK, 1 row affected (${(stop - start) / 1000} sec)`
            : `\nQuery OK, ${rows.changedRows !== undefined ? rows.changedRows : rows.affectedRows} rows affected (${(stop - start) / 1000} sec)`;
          if (rows.info !== '') {
            info = `${info}\n${rows.info}`;
          }
        }
        this.logger.debug(`[DB] ${sqlString}${info}`);
      }
    }
    return rows;
  }

  /**
   * 开始事务
   * @param {object} 数据库连接
   */
  async beginTransaction(conn) {
    await conn.beginTransaction();
  }

  /**
   * 提交事务
   * @param {object} 数据库连接
   */
  async commit(conn) {
    await conn.commit();
  }

  /**
   * 回滚事务
   * @param {object} 数据库连接
   */
  async rollback(conn) {
    if (conn) {
      await conn.rollback();
    }
  }
}

module.exports = exports = Db;
