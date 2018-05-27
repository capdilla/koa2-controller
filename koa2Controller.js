const Router = require('koa-router')

class koa2Controller {

  constructor(props) {
    this.prefix = '';
    this.props = props;

    this.allowedMethods = true;
    this.allowedMethodsOptions;
  }

  /*
   * this action execute before the function is call
   * @returns boolean
   * @param String method is the function that is invoke
   * @param Object ctx 
   * @param Object next 
   */
  beforeAction(method, ctx, next) { return true; }

  /**
   * this action execute after the function is call
   * @returns boolean
   * @param String method is the function that is invoke
   * @param Object ctx 
   * @param Object next 
   */
  afterAction(method, ctx, next) { return true; }

  /**
   * {actionName:string,rules:[array of rulesobject]}
   * rulesObject = {name:string,type:string=>required}
   */
  paramsBehaviour() { return [] }

  /**
   * 
   * handle and valid the action
   * @returns function
   * @param String method 
   * @param Object ctx 
   * @param Object next 
   * @param Int id 
   */
  async dispatchAction(method, ctx, next, id) {
    let flag;
    const beforeAct = this.beforeAction(ctx, next)

    if (beforeAct == true) {

      if (id) {
        flag = await this[method](id, ctx, next);
      } else {
        flag = await this[method](ctx, next);
      }

    } else {
      return beforeAct
    }

    const afterAct = this.afterAction(method, ctx, next)

    if (afterAct == true) {
      return flag;
    } else {
      return afterAct;
    }

  }

  /**
   * 
   * @returns all the function has have get,post,del,put
   */
  getAllFuncs() {

    let functions = [
      { type: 'get', name: '', regex: /^get+[A-Z]+.{1,}$/, methods: [] },
      { type: 'post', name: '', regex: /^post+[A-Z]+.{1,}$/, methods: [] },
      { type: 'put', name: '', regex: /^put+[A-Z]+.{1,}$/, methods: [] },
      { type: 'del', name: '', regex: /^del+[A-Z]+.{1,}$/, methods: [] }
    ];

    let props = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    functions.forEach(func => {
      func.methods = props.filter(p => func.regex.test(p))
    })

    return functions
  }


  async _findBehaviour(actionName, ctx, next) {
    const arr = this.paramsBehaviour();

    if (arr[actionName]) {
      const rules = arr[actionName].rules;

      let flag = true;
      const { body } = ctx.request;

      let response = { message: 'some elements are require', requires: [] };

      rules.forEach(rule => {
        if (!Object.keys(body).includes(rule.name)) {
          flag = false;
          response.requires.push(rule.name)
        }
      });

      if (flag) {
        return await next()
      } else {
        return ctx.body = response
      }
    } else {
      return next()
    }

  }

  /**
   * @returns koa-router instance 
   */
  getRoutes() {
    const router = new Router({ prefix: this.prefix })

    this.getAllFuncs().forEach(func => {

      func.methods.forEach(method => {

        let pathName = '/';
        const methodName = method.replace(`${func.type}`, '').toLowerCase();

        if (methodName != 'index') {
          pathName = `/${methodName}`
        }

        router.use(pathName, async (ctx, next) => this._findBehaviour(method, ctx, next))

        if (this.requireId(this[method])) {

          //create the http request `get|post|delete|put` with id
          router[func.type](`${pathName}/:id`, async (ctx, next) => this.dispatchAction(method, ctx, next, ctx.params.id))
        } else {
          //create the http request `get|post|delete|put` without id
          router[func.type]
            (
            `${pathName}`,//name of the path
            async (ctx, next) => this.dispatchAction(method, ctx, next) // function 
            )
        }

      })

    })

    return router
  }


  /**
   * 
   * valid if the function require id
   * return boolean
   * @param Function func 
   * @returns boolean
   */
  requireId(func) {
    const parameters = this.getParameters(func);
    const valid = this.validFunctionParameters(parameters)

    return parameters.includes('id')
  }

  /**
   * valid if the function contain the parameters in order id,ctx,next or ctx,next
   * @param {*} parameters 
   * @returns boolean
   */
  validFunctionParameters(parameters) {
    if (parameters == 'id,ctx,next' || parameters == 'ctx,next' || parameters == 'ctx' || parameters == 'id,ctx') {
      return true
    } else {
      throw new Error(`Parameters order must be 'id,ctx,next' or 'ctx,next' the order is ${parameters}`)
    }

  }

  /**
   * return the parameters of a function
   * @param Function func 
   */
  getParameters(func) {
    return new RegExp(func.name + '\\s*\\((.*?)\\)').exec(func.toString().replace(/\n/g, ''))[1].replace(/\/\*.*?\*\//g, '').replace(/ /g, '');
  }

}

module.exports = koa2Controller