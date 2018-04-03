const Router = require('koa-router')

/**
 * find all the files in a path to get all the routes generated there
 * @param Object opts 
 */
class controllerRoutes {
  constructor(opts) {
    this.options = {
      path: '/../../app/controllers/',
      regexToFile: /Controller/g,
      prefix: '',
      absolutePath: __dirname,
      props: {}
    }
    this.options = { ...this.options, ...opts };
    this.router = new Router({ prefix: this.options.prefix });
    this.getRoutes();
  }

  getRoutes() {
    var normalizedPath = require("path").join(this.options.absolutePath, this.options.path);

    let routes = [];

    require("fs").readdirSync(normalizedPath).forEach((file, key) => {
      var re = new RegExp(this.regexToFile)
      if (re.test(file)) {

        let moduleController = require(this.options.absolutePath + this.options.path + file)
        let controller = new moduleController(this.options.props)

        routes.push(controller.getRoutes().routes())

        if (controller.allowedMethods) {
          if (typeof controller.allowedMethodsOptions == 'undefined') {
            routes.push(controller.getRoutes().allowedMethods())
          } else {
            routes.push(controller.getRoutes().allowedMethods(controller.allowedMethodsOptions))
          }
        }
      }

    });

    this.router.use(...routes);
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods(options) {
    return this.router.allowedMethods(options);
  }

  routerInstance() {
    return this.router;
  }

}

module.exports = controllerRoutes;