export default (store) => ({
  path : 'gallery',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Gallery = require('./containers/GalleryContainer').default
      cb(null, Gallery)
    }, 'gallery')
  }
})
