import { injectReducer } from 'store/reducers'

export default (store) => ({
  path : 'product/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ProductRegister = require('./containers/ProductRegisterContainer').default
      const reducer = require('./modules/productRegister').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'productRegister', reducer })

      /*  Return getComponent   */
      cb(null, ProductRegister)

    /* Webpack named bundle   */
    }, 'product-register')
  }
})
