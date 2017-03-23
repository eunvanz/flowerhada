export default (store) => ({
  path: 'order-list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const OrderList = require('./containers/OrderListContainer').default
      cb(null, OrderList)
    }, 'order-list')
  }
})
