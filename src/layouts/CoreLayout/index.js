// export default (store) => ({
//   /*  Async getComponent is only invoked when route matches   */
//   getComponent (nextState, cb) {
//     /*  Webpack - use 'require.ensure' to create a split point
//         and embed an async module loader (jsonp) when bundling   */
//     require.ensure([], (require) => {
//       /*  Webpack - use require callback to define
//           dependencies for bundling   */
//       const CoreLayout = require('./CoreLayoutContainer').default
//       /*  Return getComponent   */
//       cb(null, CoreLayout)
//     /* Webpack named bundle   */
//     }, 'CoreLayout')
//   }
// })
import CoreLayout from './CoreLayout'

export default CoreLayout
