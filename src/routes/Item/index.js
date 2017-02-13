import { injectReducer } from 'store/reducers'

export default (store) => ({
  path: 'item/:type/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const item = require('./containers/ItemContainer').default
      const reducer = require('./modules/item').default

      injectReducer(store, { key: 'item', reducer })
      /*  Return getComponent   */
      cb(null, item)

    /* Webpack named bundle   */
    }, 'item')
  }
})
