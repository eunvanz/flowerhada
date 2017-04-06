import { connect } from 'react-redux'
import { fetchOrders, fetchAndAppendMoreOrders } from 'store/order'

import OrderListView from '../components/OrderListView'

const mapDispatchToProps = {
  fetchOrders,
  fetchAndAppendMoreOrders
}

const mapStateToProps = (state) => ({
  orderList: state.order.orderList,
  authUser: state.authUser,
  cartList: state.cart.cartList
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderListView)
