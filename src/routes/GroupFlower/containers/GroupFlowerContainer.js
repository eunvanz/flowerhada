import { connect } from 'react-redux'

import GroupFlowerView from '../components/GroupFlowerView'
import { fetchCartsByUserId } from 'store/cart'

const mapDispatchToProps = {
  fetchCartsByUserId
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupFlowerView)
