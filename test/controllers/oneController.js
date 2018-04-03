const koa2Controller = require('../../koa2Controller');

class oneController extends koa2Controller {

  constructor(props) {
    super(props)

    this.allowedMethodsOptions = {
      throw: true,
    }
    
  }

  getHello(ctx, next) {
    return ctx.body = { foo: "Hello world" }
  }

  getUser(id, ctx) {
    return ctx.body = {
      message: `user id : ${id}`
    }
  }

  postCreate(ctx) {
    return ctx.body = { foo: "created" }
  }

  putUser(id, ctx) {
    return ctx.body = {
      message: `user id : ${id} , updated`
    }
  }

  delUser(id, ctx) {
    return ctx.body = {
      message: `user id : ${id} , deleted`
    }
  }

}

module.exports = oneController;
