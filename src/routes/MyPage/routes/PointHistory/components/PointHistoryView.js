import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import keygen from 'keygenerator'
import { convertSqlDateToStringDateOnly } from 'common/util'
import numeral from 'numeral'
import Button from 'components/Button'
import { getPointHistoryByUserId } from 'common/PointHistoryService'

class PointHistoryView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pointHistories: [],
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
    this._fetchAndSetPointHistories = this._fetchAndSetPointHistories.bind(this)
  }
  componentDidMount () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    } else {
      this.props.fetchUserByUserId(this.props.user.id)
      .then(() => {
        return this._fetchAndSetPointHistories()
      })
    }
  }
  _fetchAndSetPointHistories () {
    getPointHistoryByUserId(this.props.user.id, this.state.curPage, this.state.perPage)
    .then(res => {
      const pointHistories = res.data.content
      const { totalPage, number, totalElements, numberOfElements, last } = res.data
      this.setState({
        pointHistories: this.state.pointHistories.concat(pointHistories),
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
    this._fetchAndSetPointHistories()
  }
  render () {
    const { user } = this.props
    const { pointHistories } = this.state
    if (!user) {
      this.context.router.push('/login')
      return null
    }
    const renderOrderElements = () => {
      if (pointHistories.length === 0) {
        return (
          <tr>
            <td colSpan={3} className='text-center' style={{ height: '200px' }}>포인트 내역이 없습니다.</td>
          </tr>
        )
      }
      return pointHistories.map(pointHistory => {
        const textColor = pointHistory.amount < 0 ? 'text-danger' : 'text-default'
        return (
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(pointHistory.date)}</td>
            <td className='text-center'>{pointHistory.action}</td>
            <td className='text-center'><span className={textColor}>{pointHistory.amount > 0 ? '+' : ''}{numeral(pointHistory.amount).format('0,0')}</span>P</td>
          </tr>
        )
      })
    }
    const renderMoreButton = () => {
      if (!this.state.last) {
        return (
          <tr>
            <td colSpan={6}>
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
        <table className='table cart table-hover table-colored'>
          <thead>
            <tr>
              <th className='text-center'>날짜</th>
              <th className='text-center'>활동</th>
              <th className='text-center'>포인트변동</th>
            </tr>
          </thead>
          <tbody>
            {renderOrderElements()}
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
            <div className='text-left'>
              <h3>현재 보유 포인트: <span className='text-default'>{numeral(user.point).format('0,0')}</span>P</h3>
            </div>
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

PointHistoryView.contextTypes = {
  router: PropTypes.object.isRequired
}

PointHistoryView.propTypes = {
  user: PropTypes.object.isRequired,
  fetchUserByUserId: PropTypes.func.isRequired
}

export default PointHistoryView
