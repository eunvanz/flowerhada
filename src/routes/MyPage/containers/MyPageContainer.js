import { connect } from 'react-redux'
import { fetchOrdersByUserId } from 'store/order'
import { fetchCartsByUserId } from 'store/cart'
import { fetchUserByUserId } from 'store/user'
import { fetchAuthUser } from 'store/authUser'

import MyPageView from '../components/MyPageView'

const mapDispatchToProps = {
  fetchOrdersByUserId,
  fetchCartsByUserId,
  fetchUserByUserId,
  fetchAuthUser
}

const mapStateToProps = (state) => ({
  user: state.user,
  carts: state.cart.cartList,
  orders: state.order.orderList
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPageView)
