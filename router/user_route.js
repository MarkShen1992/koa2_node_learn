  const router = require('koa-router')()
  const UserController = require('../controller/user')
  module.exports = (app) => {
    router.get('/user', UserController.login)

    router.post('/user/register', UserController.register)

    app.use(router.routes()).use(router.allowedMethods())
  }