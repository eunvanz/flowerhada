import { connect } from 'react-redux'
import { clearOrderTransaction } from 'store/order'
import { fetchCartsByUserId } from 'store/cart'
import { fetchUserByUserId } from 'store/user'

import OrderCompleteView from '../components/OrderCompleteView'

const mapDispatchToProps = {
  clearOrderTransaction,
  fetchCartsByUserId,
  fetchUserByUserId
}

const mapStateToProps = (state) => ({
  orderTransaction: state.order.orderTransaction
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderCompleteView)
