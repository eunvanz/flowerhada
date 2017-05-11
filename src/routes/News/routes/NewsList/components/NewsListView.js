import React, { PropTypes } from 'react'
import { convertSqlDateToStringDateOnly } from 'common/util'
import Button from 'components/Button'
import keygen from 'keygenerator'
import Loading from 'components/Loading'

class NewsListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curPage: 0,
      perPage: 10,
      isLoading: false
    }
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
  }
  componentDidMount () {
    const { curPage, perPage } = this.state
    this.props.fetchBoardsByCategory('news', curPage, perPage)
  }
  _handleOnClickMoreList () {
    this.setState({ isLoading: true })
    const { curPage, perPage } = this.state
    return this.props.fetchAndAppendBoards('news', curPage + 1, perPage)
    .then(() => {
      this.setState({ curPage: curPage + 1 })
      return Promise.resolve()
    })
    .then(() => {
      this.setState({ isLoading: false })
    })
  }
  render () {
    const { boardList } = this.props
    const renderNewsElements = () => {
      const returnComponent = []
      if (boardList.content.length === 0) {
        return (
          <tr>
            <td colSpan={4} className='text-center' style={{ height: '200px' }}>뉴스가 없습니다.</td>
          </tr>
        )
      }
      boardList.content.forEach(board => {
        returnComponent.push(
          <tr key={keygen._()}>
            <td className='text-center hidden-xs'>{convertSqlDateToStringDateOnly(board.regDate)}</td>
            <td><a onClick={() => this.context.router.push(`/news/${board.id}`)}
              style={{ cursor: 'pointer' }}>{board.title}</a></td>
            {/* <td className='text-center hidden-xs'>{board.view}</td> */}
            <td className='text-center hidden-xs'>꽃하다</td>
          </tr>
        )
      })
      return returnComponent
    }
    const renderMoreButton = () => {
      if (!boardList.last) {
        return (
          <tr>
            <td colSpan={5}>
              <Button
                className='btn-block'
                onClick={this._handleOnClickMoreList}
                process={this.state.isLoading}
                square
                color='gray'
                textComponent={
                  <span>
                    <i className='fa fa-angle-down' /> <span className='text-default'>
                      {boardList.totalPages - 1 -
                      boardList.number === 1 ? boardList.totalElements -
                      (boardList.number + 1) * boardList.numberOfElements
                      : boardList.numberOfElements}</span>건 더 보기
                  </span>
                }
              />
            </td>
          </tr>
        )
      }
    }
    const renderNewsList = () => {
      return (
        <table className='table cart table-hover table-colored'>
          <thead>
            <tr>
              <th className='text-center hidden-xs' style={{ width: '150px' }}>등록일</th>
              <th className='text-center'>제목</th>
              {/* <th className='text-center hidden-xs' style={{ width: '150px' }}>조회</th> */}
              <th className='text-center hidden-xs' style={{ width: '150px' }}>작성자</th>
            </tr>
          </thead>
          <tbody>
            {renderNewsElements()}
            {renderMoreButton()}
          </tbody>
        </table>
      )
    }
    return (
      <div>
        {this.props.isAdmin &&
          <Button textComponent={<span>뉴스등록</span>} color='dark'
            onClick={() => this.context.router.push('/news/register/new')} />}
        {boardList && renderNewsList()}
        {!boardList && <Loading text='뉴스를 불러오는 중...' />}
      </div>
    )
  }
}

NewsListView.contextTypes = {
  router: PropTypes.object.isRequired
}

NewsListView.propTypes = {
  fetchBoardsByCategory: PropTypes.func.isRequired,
  fetchAndAppendBoards: PropTypes.func.isRequired,
  boardList: PropTypes.object,
  isAdmin: PropTypes.bool
}

export default NewsListView
