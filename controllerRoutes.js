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
      props: {}
    }
    this.options = { ...this.options, ...opts };
    this.router = new Router({ prefix: this.options.prefix });
    this.getRoutes();
  }

  getRoutes() {
    var normalizedPath = require("path").join(__dirname, this.options.path);

    let routes = [];

    require("fs").readdirSync(normalizedPath).forEach((file, key) => {

      if (this.options.regexToFile.test(file)) {
        let moduleController = require(__dirname + this.options.path + file)
        routes.push(new moduleController(this.options.props).getRoutes().routes())
      }

    });

    this.router.use(...routes);
  }

  routes() {
    return this.router.routes();
  }

  get routerInsistence() {
    return this.router;
  }


}

module.exports = controllerRoutes;