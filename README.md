[![Build Status](https://travis-ci.org/capdilla/koa2-controller.svg?branch=master)](https://travis-ci.org/capdilla/koa2-controller)

# koa2-controller
library to handle the routes and controller at same time

## Installation
```sh
npm i koa2-controller-router --save
```

**Example**  
Basic usage:
  `of koa2Controller`

```javascript
const {koa2Controller} = require('koa2-controller-router')

class testController extends koa2Controller {

  //if you need to set parameters 
  constructor(props) {
    super(props)
  }

  paramsBehaviour() {
    return {
      postCreate: {
        rules: [
          { name: 'mail', type: 'require' },// say to require this
          { name: 'password', type: 'require' },
        ]
      },
    }
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

  /**
   *  if you are using koa-views you can use the method renderView 
   * to render a view that match, instead use ctx.render('folder/index.ejs') use ctx.render('index.ejs')
   * your view have to be in a folder with the same name of the controller
   * for example TestController the method match only Test in lower case
  */
  allView(ctx) {
    return ctx.renderView("index.ejs", { name: 'my awsome test' })
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
  const { controllerRoutes } = require('koa2-controller-router')
  //find in the default path and set props to the routes
  app.use(new controllerRoutes({props:{ db:'db conection',...etc }}).routes())

  //find in a diferent path and diferent prefix
  const privateControllers = new controllerRoutes({
    absolutePath: __dirname + '/app/controllers/private/',
    prefix: '/v2'
  })
  
  app.use(privateControllers.routes())

  app.listen(3000, () => {
    console.log("listen")
  })
```
## Testing

```sh
npm run test
```