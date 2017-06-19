export default (store) => ({
  path : 'tutor',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const TutorList = require('./containers/TutorListContainer').default
      cb(null, TutorList)
    }, 'tutor-list')
  }
})
