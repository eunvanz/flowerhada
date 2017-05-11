export default (store) => ({
  path: 'register/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const newsRegister = require('./containers/NewsRegisterContainer').default
      cb(null, newsRegister)
    }, 'news-register')
  }
})
