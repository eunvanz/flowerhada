export default (store) => ({
  path : 'group-flower',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const GroupFlower = require('./containers/GroupFlowerContainer').default
      cb(null, GroupFlower)
    }, 'group-flower')
  }
})
