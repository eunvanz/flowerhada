import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import keygen from 'keygenerator'
import { convertSqlDateToStringDateOnly } from 'common/util'
import { Link } from 'react-router'
import numeral from 'numeral'
import Button from 'components/Button'
import { cancelPayment, updateOrder, getOrderById } from 'common/OrderService'
import { putCart } from 'common/CartService'

class OrderListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      orders: [],
      curPage: 0,
      perPage: 10,
      isLoading: false,
      initialized: false,
      cancelProcess: false
    }
    this._initialize = this._initialize.bind(this)
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
    this._handleOnClickCancel = this._handleOnClickCancel.bind(this)
    this._doCancel = this._doCancel.bind(this)
  }
  componentDidMount () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    } else {
      this.props.fetchOrdersByUserId(this.props.user.id, 0, 10) // 현재페이지, 페이지당 개수
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
  _doCancel (order) {
    this.props.setMessageModalShow(false)
    this.setState({ cancelProcess: true })
    const proms = []
    const type = order.carts[0].lesson ? 'lesson' : 'product'
    const status = type === 'lesson' ? '등록취소' : '주문취소'
    const updatedOrder = Object.assign({}, order, { status })
    getOrderById(order.id)
    .then(res => {
      if (res.data.status !== '등록접수' && res.data.status !== '등록완료' && res.data.status !== '주문접수') {
        return Promise.reject({ data: { message: '취소할 수 없는 상품입니다.' } })
      } else {
        return Promise.resolve()
      }
    })
    .then(res => {
      return cancelPayment(updatedOrder)
    })
    .then(res => {
      if (res.data.code !== 0) return Promise.reject(res)
      // cart 업데이트
      for (const cart of order.carts) {
        const updatedCart = Object.assign({}, cart, { status, transDate: null })
        proms.push(putCart(updatedCart, updatedCart.id))
      }
      // order 업데이트
      proms.push(updateOrder(updatedOrder, updatedOrder.id))
      return Promise.all(proms)
    })
    .then(res => {
      this.setState({ cancelProcess: false })
      const updatedOrders = this.state.orders.map(o => {
        if (order.id === o.id) {
          o.status = status
        }
        return o
      })
      this.setState({ orders: updatedOrders })
    })
    .catch(res => {
      window.alert('처리 중 에러 발생 - ' + res.data ? res.data.message : null)
      this.setState({ cancelProcess: false })
    })
  }
  _handleOnClickCancel (order) {
    const messageModal = {
      show: true,
      message: '정말 취소하시겠습니까?',
      cancelBtnTxt: '아니오',
      confirmBtnTxt: '예',
      onConfirmClick: () => this._doCancel(order),
      process: false
    }
    this.props.setMessageModal(messageModal)
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
    const renderCancelButton = order => {
      const { status } = order
      let returnComponent = null
      if (status === '등록접수' || status === '등록완료' || status === '주문접수') {
        returnComponent =
          <span>
            <br />
            <Button
              size='sm'
              color='dark'
              textComponent={<span>취소하기</span>}
              process={this.state.cancelProcess}
              onClick={() => this._handleOnClickCancel(order)} />
          </span>
      }
      return returnComponent
    }
    const renderOrderElements = () => {
      if (orders.length === 0) {
        return (
          <tr>
            <td colSpan={6} className='text-center' style={{ height: '100px' }}>구매 내역이 없습니다.</td>
          </tr>
        )
      }
      return orders.map(order => {
        return (
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(order.updateDate)}</td>
            <td>{renderProductTitles(order.carts)}</td>
            <td className='text-center hidden-xs'>{numeral(order.pointSpent).format('0,0')}P</td>
            <td className='text-center hidden-xs'>{numeral(order.totalAmount - order.pointSpent).format('0,0')}원</td>
            <td className='text-center'>{order.status}{renderCancelButton(order)}</td>
            <td className='text-center hidden-xs'>{order.transportCode}</td>
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
  appendOrdersByUserId: PropTypes.func.isRequired,
  setMessageModal: PropTypes.func.isRequired,
  setMessageModalShow: PropTypes.func.isRequired
}

export default OrderListView
