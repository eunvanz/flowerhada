import { connect } from 'react-redux'
import NewsDetailView from '../components/NewsDetailView'
import { fetchBoard, unselectBoard } from 'store/board'

const mapDispatchToProps = {
  fetchBoard,
  unselectBoard
}

const mapStateToProps = (state) => ({
  news: state.board.selected,
  isAdmin: state.authUser.data &&
    state.authUser.data.authorities.filter((data) => data.authority === 'ADMIN').length > 0
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetailView)
