const koa2Controller = require('../../koa2Controller');

class oneController extends koa2Controller {

  constructor() {
    super()
  }

  getHello(ctx, next) {
    return ctx.body = "Hello world"
  }

  postCreate(ctx) {
    return ctx.body = "created"
  }

  putUser(id, ctx) {
    return ctx.body = `user id : ${id} , updated`
  }

  delUser(id, ctx) {
    return ctx.body = `user id : ${id} , deleted`
  }

}

module.exports = oneController;
