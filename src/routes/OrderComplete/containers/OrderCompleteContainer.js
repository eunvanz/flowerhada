import { connect } from 'react-redux'
import { clearOrderTransaction } from 'store/order'
import { fetchCartsByUserId } from 'store/cart'

import OrderCompleteView from '../components/OrderCompleteView'

const mapDispatchToProps = {
  clearOrderTransaction,
  fetchCartsByUserId
}

const mapStateToProps = (state) => ({
  orderTransaction: state.order.orderTransaction
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderCompleteView)
