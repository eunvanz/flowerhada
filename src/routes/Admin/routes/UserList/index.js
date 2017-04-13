import { injectReducer } from 'store/reducers'

export default (store) => ({
  path : 'user-list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const UserList = require('./containers/UserListContainer').default
      const reducer = require('./modules/userList').default
      injectReducer(store, { key: 'userList', reducer })
      cb(null, UserList)
    }, 'UserList')
  }
})
