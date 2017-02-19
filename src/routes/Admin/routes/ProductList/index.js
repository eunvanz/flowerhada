// import { injectReducer } from 'store/reducers'

export default (store) => ({
  path : 'product',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const LessonList = require('./containers/ProductListContainer').default
      // const reducer = require('./modules/lessonList').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'lessonList', reducer })

      /*  Return getComponent   */
      cb(null, LessonList)

    /* Webpack named bundle   */
    }, 'product-list')
  }
})
