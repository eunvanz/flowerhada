export default (store) => ({
  path: 'point-history',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const PointHistory = require('./containers/PointHistoryContainer').default
      cb(null, PointHistory)
    }, 'point-history')
  }
})
