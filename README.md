# koa2-controller
library to handle the routes and controller at same time

**Example**  
Basic usage:
  `of koa2Controller`

```javascript
const {koa2Controller} = require('koa2-controller')

class testController extends koa2Controller {

  constructor() {
    super()
  }

  //create a http get
  getHello(ctx, next) {
    return ctx.body = "Hello world"
  }

  //create a http post
  postCreate(ctx) {
    return ctx.body = "created"
  }

  //create a http put
  putUser(id, ctx) {
    return ctx.body = `user id : ${id} , updated`
  }

  //create a http del
  delUser(id, ctx) {
    return ctx.body = `user id : ${id} , deleted`
  }

}
```

Basic usage:
  `of controllerRoutes`

```javascript
  const Koa = require('koa');
  const app = new Koa();

  //require this
  const {controllerRoutes} = require('koa2-controller') 
  app.use(controllerRoutes().routes())

  app.listen(3000, () => {
    console.log("listen")
  })
```