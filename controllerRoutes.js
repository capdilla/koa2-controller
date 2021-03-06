const Router = require('koa-router');
const path = require('path')


/**
 * find all the files in a path to get all the routes generated there
 * @param Object opts 
 */
class controllerRoutes {
  constructor(opts) {
    this.options = {
      regexToFile: /Controller/g,
      prefix: '',
      absolutePath: path.join(__dirname, '/../../' + 'app/controllers/'),
      props: {}
    }
    this.options = { ...this.options, ...opts };
    this.router = new Router({ prefix: this.options.prefix });
    this.getRoutes();
  }

  getRoutes() {
    var normalizedPath = path.join(this.options.absolutePath);

    let routes = [];

    require("fs").readdirSync(normalizedPath).forEach((file, key) => {
      var re = new RegExp(this.regexToFile)
      if (re.test(file)) {
        let moduleController = require(this.options.absolutePath + file)
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