import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import keygen from 'keygenerator'
import { convertSqlDateToStringDateOnly } from 'common/util'
import { Link } from 'react-router'
import numeral from 'numeral'
import Button from 'components/Button'

class OrderListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      orders: [],
      curPage: 0,
      perPage: 10,
      isLoading: false,
      initialized: false
    }
    this._initialize = this._initialize.bind(this)
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
  }
  componentDidMount () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    } else {
      this.props.fetchOrdersByUserId(this.props.user.id, 0, 10) // 현재페이지, 페이지당 개수
      .then(() => {
        this.props.fetchCartsByUserId(this.props.user.id)
      })
      .then(() => {
        const orders = this.props.orders.content.map(order => {
          order.carts = this.props.carts.filter(cart => cart.orderId === order.id)
          return order
        })
        this.setState({ orders })
      })
      .then(() => {
        this._initialize()
      })
    }
  }
  _initialize () {
    this.setState({
      initialized: true
    })
  }
  _handleOnClickMoreList () {
    this.setState({ curPage: this.state.curPage + 1, isLoading: true })
    this.props.appendOrdersByUserId(this.props.user.id, this.state.curPage + 1, this.state.perPage)
    .then(() => {
      this.setState({ isLoading: false })
      const orders = this.props.orders.content.map(order => {
        order.carts = this.props.carts.filter(cart => cart.orderId === order.id)
        return order
      })
      this.setState({ orders })
    })
  }
  render () {
    const { user } = this.props
    const { orders } = this.state
    if (!user) {
      this.context.router.push('/login')
      return null
    }
    const renderProductTitles = carts => {
      return carts.map(cart => {
        const type = cart.lesson ? 'lesson' : 'product'
        return (
          <span key={keygen._()}><Link to={`/item/${type}/${type === 'lesson' ? cart.lessonId : cart.productId}`}>{cart.lesson ? cart.lesson.title : cart.product.title}</Link> <small>x {cart.quantity}</small><br /></span>
        )
      })
    }
    const renderOrderElements = () => {
      return orders.map(order => {
        return (
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(order.updateDate)}</td>
            <td>{renderProductTitles(order.carts)}</td>
            <td className='text-center hidden-xs'>{numeral(order.pointSpent).format('0,0')}P</td>
            <td className='text-center hidden-xs'>{numeral(order.totalAmount - order.pointSpent).format('0,0')}원</td>
            <td className='text-center'>{order.status}</td>
            <td className='text-center hidden-xs'>121212</td>
          </tr>
        )
      })
    }
    const renderMoreButton = () => {
      if (!this.props.orders.last) {
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
                      {this.props.orders.totalPages - 1 -
                      this.props.orders.number === 1 ? this.props.orders.totalElements -
                      (this.props.orders.number + 1) * this.props.orders.numberOfElements
                      : this.props.orders.numberOfElements}</span>건 더 보기
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
              <th className='text-center'>주문일자</th>
              <th className='text-center'>상품명</th>
              <th className='text-center hidden-xs'>사용포인트</th>
              <th className='text-center hidden-xs'>결제금액</th>
              <th className='text-center'>상태</th>
              <th className='text-center hidden-xs'>운송장번호</th>
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

OrderListView.contextTypes = {
  router: PropTypes.object.isRequired
}

OrderListView.propTypes = {
  fetchOrdersByUserId: PropTypes.func.isRequired,
  fetchCartsByUserId: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  carts: PropTypes.array,
  orders: PropTypes.object,
  appendOrdersByUserId: PropTypes.func.isRequired
}

export default OrderListView
