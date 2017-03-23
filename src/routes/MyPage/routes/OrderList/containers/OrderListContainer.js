import { connect } from 'react-redux'
import { fetchOrdersByUserId, appendOrdersByUserId } from 'store/order'
import { fetchCartsByUserId } from 'store/cart'

import OrderListView from '../components/OrderListView'

const mapDispatchToProps = {
  fetchOrdersByUserId,
  fetchCartsByUserId,
  appendOrdersByUserId
}

const mapStateToProps = (state) => ({
  user: state.user,
  carts: state.cart.cartList,
  orders: state.order.orderList
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderListView)
