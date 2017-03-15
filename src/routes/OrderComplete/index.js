export default (store) => ({
  path: 'order-complete',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const OrderComplete = require('./containers/OrderCompleteContainer').default
      cb(null, OrderComplete)
    }, 'order-complete')
  }
})
