export default (store) => ({
  path: 'cart/:type',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Cart = require('./containers/CartContainer').default
      // const reducer = require('./modules/login').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'login', reducer })

      /*  Return getComponent   */
      cb(null, Cart)

    /* Webpack named bundle   */
    }, 'cart')
  }
})
