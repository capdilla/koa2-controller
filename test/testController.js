const koa2Controller = require('../koa2Controller');
const assert = require('chai').assert;
const Router = require('koa-router');

class testController extends koa2Controller {

  constructor(props) {
    super(props)
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


const router = new Router({ prefix: this.prefix })

router.get('/hello', async (ctx, next) => ctx.body = "Hello world")
router.post('/create', async (ctx, next) => ctx.body = "created")
router.put('/user/:id', async (ctx, next) => ctx.body = `user id : ${ctx.params.id} , updated`)
router.del('/user/:id', async (ctx, next) => ctx.body = `user id : ${ctx.params.id} , deleted`)

const test = new testController().getRoutes()

describe("test koa2-controller have to be the same at router", () => {
  it('test path /hello sould be same at router ', () => {
    const testString = JSON.stringify(test.routes().router.stack[0]);
    const routerString = JSON.stringify(router.routes().router.stack[0]);
    assert.equal(testString, routerString);
  });
  it('test path post /create', () => {
    const testString = JSON.stringify(test.routes().router.stack[1]);
    const routerString = JSON.stringify(router.routes().router.stack[1]);
    assert.equal(testString, routerString);
  })
  it('test path put /user', () => {
    const testString = JSON.stringify(test.routes().router.stack[2]);
    const routerString = JSON.stringify(router.routes().router.stack[2]);
    assert.equal(testString, routerString);
  })
  it('test path del /user', () => {
    const testString = JSON.stringify(test.routes().router.stack[3]);
    const routerString = JSON.stringify(router.routes().router.stack[3]);
    assert.equal(testString, routerString);
  })
})


