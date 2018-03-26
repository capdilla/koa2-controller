# koa2-controller
library to handle the routes and controller at same time

**Example**  
Basic usage:
  `of koa2Controller`

```javascript
const {koa2Controller} = require('koa2-controller')

class testController extends koa2Controller {

  //if you need to set parameters 
  constructor(props) {
    super(props)
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
  this get all the files in `/app/controllers/` by default 
  

```javascript
  const Koa = require('koa');
  const app = new Koa();

  //import this
  const { controllerRoutes } = require('koa2-controller')
  //find in the default path and set props to the routes
  app.use(new controllerRoutes({props:{ db:'db conection',...etc }}).routes())

  //find in a diferent path and diferent prefix
  const privateControllers = new controllerRoutes({
    path: '/../../app/controllers/privateControllers/',
    prefix: '/v2'
  })
  app.use(privateControllers.routes())

  app.listen(3000, () => {
    console.log("listen")
  })
```