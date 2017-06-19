export default (store) => ({
  path : 'party',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Wedding = require('./containers/WeddingContainer').default
      cb(null, Wedding)
    }, 'party')
  }
})
