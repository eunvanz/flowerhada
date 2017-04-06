export default (store) => ({
  path : 'error-list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ErrorList = require('./containers/ErrorListContainer').default
      cb(null, ErrorList)
    }, 'error-list')
  }
})
