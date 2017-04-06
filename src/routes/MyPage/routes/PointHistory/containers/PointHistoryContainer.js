import { connect } from 'react-redux'
import { fetchUserByUserId } from 'store/user'

import PointHistoryView from '../components/PointHistoryView'

const mapDispatchToProps = {
  fetchUserByUserId
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(PointHistoryView)
