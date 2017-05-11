export default (store) => ({
  path: ':id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const newsDetail = require('./containers/NewsDetailContainer').default
      cb(null, newsDetail)
    }, 'news-detail')
  }
})
