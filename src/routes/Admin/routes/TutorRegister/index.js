export default (store) => ({
  path : 'tutor/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const TutorRegister = require('./containers/TutorRegisterContainer').default
      cb(null, TutorRegister)
    }, 'tutor-register')
  }
})
