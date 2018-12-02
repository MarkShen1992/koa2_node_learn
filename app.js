  const Koa = require('koa')
  const bodyParser = require('koa-bodyparser')
  const app = new Koa()
  
  // import route model
  const homerouter = require('./router/home_route')
  const userrouter = require('./router/user_route')

  app.use(bodyParser())

  homerouter(app)
  userrouter(app)

  app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
  })