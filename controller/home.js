  module.exports = {
    index: async(ctx, next) => {
      ctx.response.body = `<h1>index page</h1>`
    },
    home: async(ctx, next) => {
      console.log(ctx.request.query)
      console.log(ctx.request.querystring)
      ctx.response.body = '<h1>HOME page</h1>'
    },
    homeParams: async(ctx, next) => {
      console.log(ctx.params)
      ctx.response.body = '<h1>HOME page /:id/:name</h1>'
    }
  }