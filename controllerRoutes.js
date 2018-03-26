const Router = require('koa-router')

module.exports = (opts) => {

  let options = {
    path: '../app/controllers/',
    regexToFile: /Controller/g
  }

  options = { ...options, ...opts };

  var normalizedPath = require("path").join(__dirname, options.path);

  let routes = [];

  require("fs").readdirSync(normalizedPath).forEach((file, key) => {

    if (options.regexToFile.test(file)) {

      let moduleController = require(options.path + file)
      routes.push(new moduleController().getRoutes().routes())

    }

  });

  const router = new Router()
  return router.use(...routes);
}


