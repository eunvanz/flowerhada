import { connect } from 'react-redux'
import { fetchUserByUserId } from 'store/user'

import ProfileView from '../components/ProfileView'

const mapDispatchToProps = {
  fetchUserByUserId
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
