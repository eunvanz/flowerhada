import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import keygen from 'keygenerator'
import { convertSqlDateToStringDateOnly } from 'common/util'
import Button from 'components/Button'
import { getAllError, putError } from 'common/ErrorService'
import $ from 'jquery'

class ErrorListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: [],
      curPage: 0,
      perPage: 10,
      isLoading: false,
      initialized: false,
      totalPage: 0,
      number: 0,
      totalElements: 0,
      numberOfElements: 0,
      last: false
    }
    this._initialize = this._initialize.bind(this)
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
    this._fetchAndSetErrors = this._fetchAndSetErrors.bind(this)
  }
  componentDidMount () {
    this._fetchAndSetErrors()
  }
  _fetchAndSetErrors () {
    getAllError(this.state.curPage, this.state.perPage)
    .then(res => {
      const errors = res.data.content
      const { totalPage, number, totalElements, numberOfElements, last } = res.data
      this.setState({
        errors: this.state.errors.concat(errors),
        totalPage,
        number,
        totalElements,
        numberOfElements,
        last
      })
      if (!this.state.initialized) {
        this._initialize()
      }
      if (this.state.isLoading) {
        this.setState({ isLoading: false })
      }
    })
  }
  _initialize () {
    this.setState({
      initialized: true
    })
  }
  _handleOnClickMoreList () {
    this.setState({ curPage: this.state.curPage + 1, isLoading: true })
    this._fetchAndSetErrors()
  }
  _handleOnClickToggleLog (id) {
    $(`#${id}`).toggle()
  }
  _handleOnClickStatus (error) {
    const { status } = error
    let updatedError
    let updatedStatus
    if (status === '미해결') updatedStatus = '해결'
    else updatedStatus = '미해결'
    updatedError = Object.assign({}, error, { status: updatedStatus })
    putError(updatedError, updatedError.id)
    .then(() => {
      this.setState({ errors: this.state.errors.map(item => {
        if (item.id === updatedError.id) {
          item.status = updatedStatus
          return item
        } else {
          return item
        }
      }) })
    })
  }
  render () {
    const { errors } = this.state
    const renderErrorElements = () => {
      const returnComponent = []
      for (const error of errors) {
        const textColor = error.status === '미해결' ? 'text-danger' : 'text-default'
        const id = keygen._()
        returnComponent.push(
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(error.date)}</td>
            <td className='text-center'>{error.user.email}</td>
            <td className='text-center'><a onClick={() => this._handleOnClickToggleLog(id)} style={{ cursor: 'pointer' }}>로그보이기/접기</a></td>
            <td className='text-center'><span
              style={{ cursor: 'pointer' }}
              className={textColor}
              onClick={() => this._handleOnClickStatus(error)}>{error.status}</span></td>
          </tr>
        )
        returnComponent.push(
          <tr style={{ display: 'none' }} id={id} key={id}>
            <td colSpan={4}>{error.log}</td>
          </tr>
        )
      }
      return returnComponent
    }
    const renderMoreButton = () => {
      if (!this.state.last) {
        return (
          <tr>
            <td colSpan={4}>
              <Button
                className='btn-block'
                onClick={this._handleOnClickMoreList}
                process={this.state.isLoading}
                square
                color='gray'
                textComponent={
                  <span>
                    <i className='fa fa-angle-down' /> <span className='text-default'>
                      {this.state.totalPages - 1 -
                      this.state.number === 1 ? this.state.totalElements -
                      (this.state.number + 1) * this.state.numberOfElements
                      : this.state.numberOfElements}</span>건 더 보기
                  </span>
                }
              />
            </td>
          </tr>
        )
      }
    }
    const renderOrderList = () => {
      return (
        <table className='table cart table-hover'>
          <thead>
            <tr>
              <th className='text-center'>날짜</th>
              <th className='text-center'>사용자</th>
              <th className='text-center'>로그</th>
              <th className='text-center'>상태</th>
            </tr>
          </thead>
          <tbody>
            {renderErrorElements()}
            {renderMoreButton()}
          </tbody>
        </table>
      )
    }
    const renderContent = () => {
      let returnComponent = null
      if (!this.state.initialized) {
        returnComponent = <Loading text='정보를 불러오는 중..' />
      } else {
        returnComponent = (
          <div>
            {renderOrderList()}
          </div>
        )
      }
      return returnComponent
    }
    return (
      <div>
        {renderContent()}
      </div>
    )
  }
}

ErrorListView.contextTypes = {
  router: PropTypes.object.isRequired
}

ErrorListView.propTypes = {
}

export default ErrorListView
