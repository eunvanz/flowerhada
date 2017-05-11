export default (store) => ({
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const news = require('./containers/NewsContainer').default
      cb(null, news)
    }, 'news')
  }
})
