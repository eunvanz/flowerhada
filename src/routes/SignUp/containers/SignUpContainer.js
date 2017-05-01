import { connect } from 'react-redux'
import { fetchAuthUser } from 'store/authUser'
import { fetchUser } from 'store/user'

import SignUp from '../components/SignUp'

const mapDispatchToProps = {
  fetchAuthUser,
  fetchUser
}

const mapStateToProps = (state) => ({
  authUser: state.authUser,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
