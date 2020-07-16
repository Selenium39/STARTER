
'use strict';

const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

const sleep = async (start, end) => {
  const diff = end - start;
  if (diff < 5000) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000 - diff);
    });
  }
};

class Schedule {
  constructor(config, db, redis, logger) {
    this.config = config;
    this.db = db;
    this.redis = redis;
    this.logger = logger;
    this.jobs = [];
  }

  imgDelete() {
    const job = 'img-delete';
    this.jobs.push(job);
    this.redis.del(job);
    schedule.scheduleJob('0 0 0 * * *', async () => {
      const flag = await this.redis.incr(job);
      if (flag === 1) {
        this.logger.info(`[${job}] start`);
        let conn;
        const start = Date.now();
        try {
          conn = await this.db.getConnection();
          const results = await this.db.query(conn,
            `SELECT img FROM templates
            UNION DISTINCT
            SELECT img FROM jobs`);

          const img = {
            tempfile: [],
            templates: [],
            bills: [],
          };
          for (const result of results) {
            const arr = result.img.split('/');
            img[arr[1]].push(arr[2]);
          }

          const [tempfile, templates, bills] = await Promise.all([
            readdir(path.join(this.config.uploads, this.config.folder.tempfile)),
            readdir(path.join(this.config.uploads, this.config.folder.templates)),
            readdir(path.join(this.config.uploads, this.config.folder.bills)),
          ]);
          const file = { tempfile, templates, bills };

          const promiseArray = [];
          for (const key in file) {
            for (const val of file[key]) {
              if (val !== '.gitignore') {
                if (!img[key].includes(val)) {
                  promiseArray.push(unlink(path.join(this.config.uploads, this.config.folder[key], val)));
                }
              }
            }
          }
          if (promiseArray.length !== 0) {
            await Promise.all(promiseArray);
          }
        } catch (error) {
          this.logger.error(error);
        } finally {
          this.db.releaseConnection(conn);
          await sleep(start, Date.now());
          await this.redis.del(job);
        }
        this.logger.info(`[${job}] end`);
      }
    });
  }

  run() {
    this.imgDelete();
    this.logger.info(`schedule: ${this.jobs.length !== 0 ? this.jobs.join(', ') : 'none'}`);
  }
};

module.exports = exports = Schedule;
