import { connect } from 'react-redux'

import PointHistoryView from '../components/PointHistoryView'

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(PointHistoryView)
