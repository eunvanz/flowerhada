import { connect } from 'react-redux'
import { fetchCartsByUserId } from 'store/cart'
import { receiveOrderTransaction } from 'store/order'
import { fetchUser } from 'store/user'

import CartView from '../components/CartView'

const mapDispatchToProps = {
  fetchCartsByUserId,
  receiveOrderTransaction,
  fetchUser
}

const mapStateToProps = (state) => {
  return ({
    carts: state.cart.cartList ? state.cart.cartList.filter(cart => cart.type === '장바구니') : null,
    user: state.user,
    orderItem: state.order.orderItem,
    authUser: state.authUser
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(CartView)
