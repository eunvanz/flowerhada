import { connect } from 'react-redux'
import { fetchCartsByUserId } from 'store/cart'

import CartView from '../components/CartView'

const mapDispatchToProps = {
  fetchCartsByUserId
}

const mapStateToProps = (state) => {
  return ({
    carts: state.cart.cartList ? state.cart.cartList.filter(cart => cart.type === '장바구니') : null,
    user: state.user,
    orderItem: state.order.orderItem
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(CartView)
