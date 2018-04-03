const koa2Controller = require('../../koa2Controller');

class fooController extends koa2Controller {

  getIndex(ctx, next) {
    return ctx.body = { foo: "Hello world from index" }
  }

  getIndex(id, ctx, next) {
    return ctx.body = { foo: `Hello world from index id :${id}` }
  }

}

module.exports = fooController;
