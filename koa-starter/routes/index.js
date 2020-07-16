const controller = require('../controller')

const router = require('koa-router')()

router.post('/user/login', controller.auth.login);

module.exports = router
