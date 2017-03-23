export default (store) => ({
  path: 'profile',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Profile = require('./containers/ProfileContainer').default
      cb(null, Profile)
    }, 'profile')
  }
})
