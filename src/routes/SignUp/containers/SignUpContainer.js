import { connect } from 'react-redux'
import { fetchAuthUser, fetchSocialAuthUser } from 'store/authUser'
import { fetchCartsByUserId } from 'store/cart'
import { fetchUser } from 'store/user'

import SignUp from '../components/SignUp'

const mapDispatchToProps = {
  fetchAuthUser,
  fetchUser,
  fetchSocialAuthUser,
  fetchCartsByUserId
}

const mapStateToProps = (state) => ({
  authUser: state.authUser,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
