const Koa = require('koa')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors');
const middleware = require('./middleware/index');
const logger = require('./lib/logger')
const errCode = require('./lib/errCode')
const router = require('./routes/index')
const config = require('./env')
const DB = require('./lib/db')
const Crypto = require('./lib/crypto');
const Redis = require('./lib/redis');
const Jwt = require('./lib/jwt')


const app = new Koa()

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(cors())
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.context.logger = logger
app.use(middleware.accessLog());

//authorization
app.use(middleware.authorization().unless({
  path: ['/user/login']
}));


// router
app.use(router.routes(), router.allowedMethods())

//config 
app.context.config = config

//mysql
app.context.db = new DB(config.db, logger)

//redis
const redis = new Redis(config.redis, logger);
app.context.redis = redis

//jwt
app.context.jwt = new Jwt(config.jwt, redis, logger)


//crypto
app.context.crypto = new Crypto(logger)

//error code
app.context.errCode = errCode

app.listen(3000)

module.exports = app
