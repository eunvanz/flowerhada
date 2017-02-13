import { injectReducer } from 'store/reducers'

export default (store) => ({
  path : 'main-banner',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const MainBanner = require('./containers/MainBannerListContainer').default
      const reducer = require('./modules/mainBanner').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'mainBanner', reducer })

      /*  Return getComponent   */
      cb(null, MainBanner)

    /* Webpack named bundle   */
    }, 'mainBanner')
  }
})
