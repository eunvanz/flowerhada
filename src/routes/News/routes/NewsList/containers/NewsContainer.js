import { connect } from 'react-redux'
import NewsListView from '../components/NewsListView'
import { fetchBoardsByCategory, fetchAndAppendBoards } from 'store/board'

const mapDispatchToProps = {
  fetchBoardsByCategory,
  fetchAndAppendBoards
}

const mapStateToProps = (state) => ({
  boardList: state.board.boardList,
  isAdmin: state.authUser.data &&
    state.authUser.data.authorities.filter((data) => data.authority === 'ADMIN').length > 0
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsListView)
