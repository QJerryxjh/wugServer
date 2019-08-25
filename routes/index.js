const Router = require('koa-router')
const controller = require('../controller')

const router = new Router()

router
  .post('/api/register', controller.user.register)
  .post('/api/login', controller.user.login)
  .post('/api/resetPwd', controller.user.resetPwd)

module.exports = router
