const assert = require('chai').assert;
const Router = require('koa-router');
const request = require('supertest');
const http = require('http')

const controllerRoutes = require("../controllerRoutes");

//koa server
const Koa = require('koa');
const app = new Koa();

const privateControllers = new controllerRoutes({
  absolutePath: __dirname + '/controllers/',
})

privateControllers.routerInstance()
app.use(privateControllers.routes())
app.use(privateControllers.allowedMethods())
// end koa server

describe('Test controllerRoutes  ', () => {



  it('get hello from oneController', () => {
    request(http.createServer(app.callback()))
      .get('/hello')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.foo, 'Hello world')
      })
  })

  it('get user with id from oneController', () => {
    request(http.createServer(app.callback()))
      .get('/user/12')
      .expect(200)
      .end((err, res) => {
        if (err) return err;

        assert.equal(res.body.message, `user id : 12`)
      })
  })


  it('post create from oneController', () => {
    request(http.createServer(app.callback()))
      .post('/create')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.foo, 'created')
      })
  })

  it('put user from oneController', () => {
    request(http.createServer(app.callback()))
      .put('/user/2')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.message, 'user id : 2 , updated')
      })
  })

  it('delete user from oneController ', () => {
    request(http.createServer(app.callback()))
      .del('/user/2')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.message, 'user id : 2 , deleted')
      })
  })

  it('get index from fooController', () => {
    request(http.createServer(app.callback()))
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.foo, 'Hello world from index')
      })
  })

  it('get index with id  from fooController', () => {
    request(http.createServer(app.callback()))
      .get('/2')
      .expect(200)
      .end((err, res) => {
        if (err) return err;
        assert.equal(res.body.foo, 'Hello world from index id :2')
      })
  })

})
