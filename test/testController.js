const koa2Controller = require('../koa2Controller');
const assert = require('chai').assert;
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const expect = require('chai').expect;
const request = require('supertest');
const http = require('http');


class testController extends koa2Controller {

  constructor(props) {
    super(props)
  }

  paramsBehaviour() {
    return {
      postCreate: {
        rules: [
          { name: 'mail', type: 'require' },
          { name: 'password', type: 'require' },
        ]
      },

    }
  }

  getIndex(ctx) {
    return ctx.body = { message: "Hello world" }
  }

  getHello(ctx, next) {
    return ctx.body = { message: "Hello world" }
  }

  postCreate(ctx) {
    return ctx.body = { message: "created" }
  }

  putUser(id, ctx) {
    return ctx.body = { message: `user id : ${id} , updated` }
  }

  delUser(id, ctx) {
    return ctx.body = { message: `user id : ${id} , deleted` }
  }
}


const router = new Router({ prefix: this.prefix })

router.get('/hello', async (ctx, next) => ctx.body = "Hello world")
router.post('/create', async (ctx, next) => ctx.body = "created")
router.put('/user/:id', async (ctx, next) => ctx.body = `user id : ${ctx.params.id} , updated`)
router.del('/user/:id', async (ctx, next) => ctx.body = `user id : ${ctx.params.id} , deleted`)

const test = new testController().getRoutes()

// describe("test koa2-controller have to be the same at router", () => {
//   it('test path /hello sould be same at router ', () => {
//     const testString = JSON.stringify(test.routes().router.stack[0]);
//     const routerString = JSON.stringify(router.routes().router.stack[0]);
//     assert.equal(testString, routerString);
//   });
//   it('test path post /create', () => {
//     const testString = JSON.stringify(test.routes().router.stack[1]);
//     const routerString = JSON.stringify(router.routes().router.stack[1]);
//     assert.equal(testString, routerString);
//   })
//   it('test path put /user', () => {
//     const testString = JSON.stringify(test.routes().router.stack[2]);
//     const routerString = JSON.stringify(router.routes().router.stack[2]);
//     assert.equal(testString, routerString);
//   })
//   it('test path del /user', () => {
//     const testString = JSON.stringify(test.routes().router.stack[3]);
//     const routerString = JSON.stringify(router.routes().router.stack[3]);
//     assert.equal(testString, routerString);
//   })
// })

describe("test koa2Controller for with correct response in http get|post|put|del", () => {
  //koa server
  const Koa = require('koa');
  const app = new Koa();

  app.use(bodyParser())
  app.use(test.routes())
  // app.use(sClass.allowedMethods())

  const server = http.createServer(app.callback())

  it('http get /, return Hello World', () =>
    request(server)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'Hello world')
      })
  );

  it('http get /hello, return Hello World', () =>
    request(server)
      .get('/hello')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'Hello world')
      })
  );

  it('http post /create, return created', () =>
    request(server)
      .post('/create')
      .set('Accept', 'application/json')
      .send({ mail: 'hello', password: 'password' })
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'created')
      })
  )

  it('trow error post /create, return Hello World', () =>
    request(server)
      .post('/create')
      .set('Accept', 'application/json')
      .send({ mail: 'hello' })
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'some elements are require');
        assert.isTrue(response.body.requires.includes('password'))
      })
  );

  it('http put /user/10, return user id : 10 , updated', () =>
    request(server)
      .put('/user/10')
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'user id : 10 , updated');
      })
  );

  it('http delete /user/10, return Hello World', () =>
    request(server)
      .del('/user/10')
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, 'user id : 10 , deleted');
      })
  );


})

describe("koa2Controller Expected an error", () => {
  it('throw error', () => {
    class errorClass extends koa2Controller {
      constructor() {
        super()
        this.prefix = '/'
      }

      getError(next, ctx) {
        return ctx.body = "this is a error";
      }
    }
    const errClass = new errorClass();
    assert.throw(errClass.validFunctionParameters, Error, `Parameters order must be 'id,ctx,next' or 'ctx,next' the order is `)
  })
})



describe("koa2Controller before and after action ", () => {
  it('before action set false', () => {
    class simpleClass extends koa2Controller {
      constructor() {
        super()
      }

      beforeAction(method, ctx, next) {
        const user = { type: 'regular' }

        if (user.type == 'admin') {
          return true
        } else {
          ctx.status = 403;
          return ctx.body = { error: "Forbidden" }
        }

      }

      getIndex(ctx) {
        return ctx.body = { foo: "this is a error" };
      }
    }

    const sClass = new simpleClass();

    //koa server
    const Koa = require('koa');
    const app = new Koa();

    app.use(sClass.getRoutes().routes())
    // app.use(sClass.allowedMethods())

    request(http.createServer(app.callback()))
      .get('/')
      .expect(403)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.error, 'Forbidden')
      })

  })

  it('after action set false', () => {
    class simpleClass extends koa2Controller {
      constructor() {
        super()
      }

      afterAction(method, ctx, next) {
        const data = { response: false }

        if (data.response) {
          return true
        } else {
          ctx.status = 409;
          return ctx.body = { error: "Your data was save but there some Conflict" }
        }

      }

      getIndex(ctx) {
        return ctx.body = { foo: "this is a error" };
      }
    }

    const sClass = new simpleClass();

    //koa server
    const Koa = require('koa');
    const app = new Koa();

    app.use(sClass.getRoutes().routes())
    // app.use(sClass.allowedMethods())

    request(http.createServer(app.callback()))
      .get('/')
      .expect(409)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.error, 'Your data was save but there some Conflict')
      })

  })
})

