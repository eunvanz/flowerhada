import { connect } from 'react-redux'
import { fetchUser } from 'store/user'
import { receiveAuthUser } from 'store/authUser'

import CoreLayout from './CoreLayout'

const mapDispatchToProps = {
  fetchUser,
  receiveAuthUser
}

export default connect(mapDispatchToProps)(CoreLayout)
