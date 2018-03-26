const assert = require('chai').assert;
const Router = require('koa-router')
const koa2Controller = require('../koa2Controller');

const controllerRoutes = require("../controllerRoutes");

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