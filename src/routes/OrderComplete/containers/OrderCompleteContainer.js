import { connect } from 'react-redux'
import { clearOrderTransaction, receiveOrderTransaction } from 'store/order'
import { fetchCartsByUserId } from 'store/cart'
import { fetchUserByUserId } from 'store/user'

import OrderCompleteView from '../components/OrderCompleteView'

const mapDispatchToProps = {
  clearOrderTransaction,
  fetchCartsByUserId,
  fetchUserByUserId,
  receiveOrderTransaction
}

const mapStateToProps = (state) => ({
  orderTransaction: state.order.orderTransaction
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderCompleteView)
