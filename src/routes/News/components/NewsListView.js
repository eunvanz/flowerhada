import React, { PropTypes } from 'react'
import TableList from 'components/TableList'
import { convertSqlDateToStringDateOnly } from 'common/util'

class NewsListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curPage: 0,
      perPage: 10
    }
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
  }
  componentDidMount () {
    this.props.fetchUsers(this.state.curPage, this.state.perPage)
  }
  _handleOnClickMoreList () {
    const { curPage, perPage } = this.state
    return this.props.fetchAndAppendUsers(curPage + 1, perPage)
    .then(() => {
      this.setState({ curPage: curPage + 1 })
      return Promise.resolve()
    })
  }
  render () {
    const { userList } = this.props
    const getElements = () => {
      if (userList) {
        return userList.content.map(user =>
          [
            convertSqlDateToStringDateOnly(user.regDate),
            user.email,
            user.name,
            user.phone,
            user.point
          ]
        )
      } else {
        return null
      }
    }
    const getRestElements = () => {
      if (userList) {
        return (
          this.props.userList.totalPages - 1 -
          this.props.userList.number === 1 ? this.props.userList.totalElements -
          (this.props.userList.number + 1) * this.props.userList.numberOfElements
          : this.props.userList.numberOfElements
        )
      } else {
        return 0
      }
    }
    return (
      <TableList
        headers={['가입일', '이메일', '이름', '연락처', '포인트']}
        elements={getElements()}
        onClickMoreBtn={this._handleOnClickMoreList}
        restElements={getRestElements()}
      />
    )
  }
}

NewsListView.contextTypes = {
  router: PropTypes.object.isRequired
}

NewsListView.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
  fetchAndAppendUsers: PropTypes.func.isRequired,
  userList: PropTypes.object
}

export default NewsListView
