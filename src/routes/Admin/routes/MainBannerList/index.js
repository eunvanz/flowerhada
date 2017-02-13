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
      const MainBannerList = require('./containers/MainBannerListContainer').default
      const reducer = require('./modules/mainBannerList').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'mainBannerList', reducer })

      /*  Return getComponent   */
      cb(null, MainBannerList)

    /* Webpack named bundle   */
    }, 'mainBannerList')
  }
})
