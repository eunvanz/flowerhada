import { connect } from 'react-redux'
import { fetchUsers, fetchAndAppendUsers } from '../modules/userList'

import UserListView from '../components/UserListView'

const mapDispatchToProps = {
  fetchUsers,
  fetchAndAppendUsers
}

const mapStateToProps = (state) => ({
  userList: state.userList
})

export default connect(mapStateToProps, mapDispatchToProps)(UserListView)
