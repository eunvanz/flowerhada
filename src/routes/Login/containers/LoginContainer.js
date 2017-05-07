import { connect } from 'react-redux'
import { fetchAuthUser, fetchSocialAuthUser } from 'store/authUser'
import { fetchUser } from 'store/user'
import { fetchCartsByUserId } from 'store/cart'

import login from '../components/login'

const mapDispatchToProps = {
  fetchAuthUser,
  fetchUser,
  fetchCartsByUserId,
  fetchSocialAuthUser
}

const mapStateToProps = (state) => ({
  authUser: state.authUser,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(login)
