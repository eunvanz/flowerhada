import { connect } from 'react-redux'
import NewsRegisterView from '../components/NewsRegisterView'
import { fetchBoard, unselectBoard } from 'store/board'

const mapDispatchToProps = {
  fetchBoard,
  unselectBoard
}

const mapStateToProps = (state) => ({
  user: state.user,
  news: state.board.selected,
  isAdmin: state.authUser.data &&
    state.authUser.data.authorities.filter((data) => data.authority === 'ADMIN').length > 0
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsRegisterView)
