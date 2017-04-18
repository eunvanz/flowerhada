import React, { PropTypes } from 'react'
import MainContainer from 'components/MainContainer'
import numeral from 'numeral'
import LessonDateInfo from 'components/LessonDateInfo'
import keygen from 'keygenerator'
import { Link } from 'react-router'
import Button from 'components/Button'
import { assemblePhoneNumber, isMobile } from 'common/util'
import { postOrderTransaction, cancelPayment } from 'common/OrderService'
import Loading from 'components/Loading'
import { postError } from 'common/ErrorService'
import Alert from 'components/Alert'

class OrderCompleteView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      orderProcess: false,
      lockUpdate: false,
      success: true,
      errorMsg: ''
    }
    this._getTotalPrice = this._getTotalPrice.bind(this)
  }
  componentDidMount () {
    const { orderTransaction } = this.props
    const { query } = this.props.location
    const { imp_uid, apply_num, vbank_num, vbank_name, vbank_holder, vbank_date, order_transaction, imp_success, error_msg } = query // eslint-disable-line
    // console.log(query)
    if (!orderTransaction && !isMobile.any()) {
      this.context.router.push('/not-found')
      return
    // eslint-disable
    } else if (imp_success === 'false') {
      this.setState({
        success: false,
        errorMsg: error_msg
      })
    } else if (isMobile.any()) { // 모바일인경우 cartView의 콜백에 해당하는 부분 실행
      const orderTransaction = JSON.parse(order_transaction)
      this.setState({ orderProcess: true })
      orderTransaction.order.uid = imp_uid
      orderTransaction.order.applyNum = apply_num
      orderTransaction.order.vbankNum = vbank_num
      orderTransaction.order.vbankName = vbank_name
      orderTransaction.order.vbankHolder = vbank_holder
      orderTransaction.order.vbankDate = vbank_date
      // eslint-enable
      postOrderTransaction(orderTransaction)
      .then(() => {
        this.props.receiveOrderTransaction(orderTransaction)
        this.setState({ orderProcess: false })
        return this.props.fetchCartsByUserId(orderTransaction.userId)
      })
      .then(() => {
        return this.props.fetchUserByUserId(orderTransaction.userId)
      })
      .then(() => {
        this.setState({ lockUpdate: true })
        this.props.clearOrderTransaction()
      })
      .catch(() => {
        const error = {
          type: '결제후처리에러',
          log: JSON.stringify(orderTransaction),
          userId: orderTransaction.userId,
          status: '미해결'
        }
        postError(error)
        .then(() => {
          return cancelPayment(orderTransaction.order)
        })
        .then(() => {
          this.setState({ orderProcess: false })
          alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
        })
      })
    } else {
      this.setState({ lockUpdate: true })
      this.props.clearOrderTransaction()
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.lockUpdate || this.state.lockUpdate) return false
    return true
  }
  _getTotalPrice () {
    const { orderTransaction } = this.props
    const items = orderTransaction.carts
    return items.reduce((acc, cart) => {
      return acc + cart.totalAmount
    }, 0)
  }
  render () {
    if (!this.state.success) {
      return (
        <MainContainer
          title='주문실패'
          bodyComponent={<Alert type='warning' text={this.state.errorMsg} />}
        />
      )
    }
    const { orderTransaction } = this.props
    if (!orderTransaction) return null
    const { order } = orderTransaction
    const items = orderTransaction.carts
    const renderOptions = cart => {
      if (cart.lesson) return <LessonDateInfo lesson={cart.lesson} />
      const optionsArray = JSON.parse(cart.options)
      let seq = -1
      const returnComponent = optionsArray.map(option => {
        seq++
        if (option.name !== '선택안함') {
          return <span key={keygen._()}>
            {option.name}
            {option.price === 0 ? '' : `(+${numeral(option.price).format('0,0')}원)`}
            {((optionsArray[seq + 1].name !== '선택안함') && (seq !== optionsArray.length - 1)) || (cart.receiveDate || cart.receiveArea) ? ' / ' : ''}
          </span>
        }
      })
      if (cart.receiveArea) {
        const receiveArea = JSON.parse(cart.receiveArea)
        returnComponent.push(<span key={keygen._()}>{receiveArea.name}{receiveArea.price === 0 ? '' : `(+${numeral(receiveArea.price).format('0,0')}원)`} / </span>)
      }
      if (cart.receiveDate) {
        returnComponent.push(<span key={keygen._()}>{cart.receiveDate} {cart.receiveTime} 수령</span>)
      }
      return returnComponent
    }
    const renderCartList = () => {
      return items.map(cart => {
        return (
          <tr key={keygen._()}>
            <td className='product'>
              <Link to={`/item/${cart.lesson ? 'lesson' : 'product'}/${cart.lessonId || cart.productId}`}>
                {cart.lesson ? cart.lesson.title : cart.product.title}
              </Link>
              <small>{renderOptions(cart)}</small>
            </td>
            <td className='price'>{`￦${numeral(cart.itemPrice).format('0,0')}`}</td>
            <td className='quantity' style={{ fontSize: '14px' }}>
              {cart.quantity}
            </td>
            <td className='amount'>￦{numeral(cart.totalAmount).format('0,0')}</td>
          </tr>
        )
      })
    }
    const renderTotalAmount = () => {
      return (
        <tr>
          <td className='total-quantity' colSpan='3'>
            총 <span>{items.length}</span>개의 아이템
          </td>
          <td className='total-amount'>
            ￦<span>{`${numeral(this._getTotalPrice()).format('0,0')}`}</span>
          </td>
        </tr>
      )
    }
    const renderPointForm = () => {
      return (
        <tr>
          <td className='total-quantity' colSpan='3'>
            포인트 사용
          </td>
          <td colSpan='2' className='form-inline text-right'>
            {numeral(orderTransaction.spentPointHistory ? (orderTransaction.spentPointHistory.amount * -1) : 0).format('0,0')}P
          </td>
        </tr>
      )
    }
    const renderTotalPayment = () => {
      return (
        <tr>
          <td className='total-quantity' colSpan='3'>
            총 결제금액
          </td>
          <td className='total-amount'>
            ￦<span className='text-default'>{numeral(this._getTotalPrice() + (orderTransaction.spentPointHistory ? orderTransaction.spentPointHistory.amount : 0)).format('0,0')}</span>
          </td>
        </tr>
      )
    }
    const renderSenderInfo = () => {
      if (orderTransaction.carts[0].lesson) return
      return (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th colSpan='2'>보내시는 분 정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: '25%' }}>이름</td>
                <td>{order.sender}</td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>{assemblePhoneNumber(JSON.parse(order.senderPhoneNumber))}</td>
              </tr>
              {order.letterMessage && order.letterMessage.length > 0 &&
                <tr>
                  <td>편지내용</td>
                  <td dangerouslySetInnerHTML={{ __html: order.letterMessage }}></td>
                </tr>
              }
            </tbody>
          </table>
          <div className='space-bottom'></div>
        </div>
      )
    }
    const renderReceiverInfo = () => {
      if (orderTransaction.carts[0].lesson) return
      return (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th colSpan='2'>받으시는 분 정보</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: '25%' }}>이름</td>
                <td>{order.receiver}</td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>{assemblePhoneNumber(JSON.parse(order.receiverPhoneNumber))}</td>
              </tr>
              <tr>
                <td>배송지 주소</td>
                <td>{`[${order.postCode}] ${order.address} ${order.restAddress}`}</td>
              </tr>
              {order.transportMessage && order.transportMessage > 0 &&
                <tr>
                  <td>배송 메시지</td>
                  <td>{order.transportMessage}</td>
                </tr>
              }
            </tbody>
          </table>
          <div className='space-bottom'></div>
        </div>
      )
    }
    const renderStudentsRows = () => {
      let idx = 0
      const studentNames = JSON.parse(order.studentNames)
      const returnComponent = studentNames.map(name => {
        return (
          <tr key={keygen._()}>
            <td>수강생 #{idx + 1}</td>
            <td>{`${name}, ${assemblePhoneNumber(JSON.parse(order.studentPhoneNumbers)[idx++])}`}</td>
          </tr>
        )
      })
      return returnComponent
    }
    const renderStudentInfo = () => {
      if (orderTransaction.carts[0].product) return
      return (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th colSpan='2'>수강생 정보</th>
              </tr>
            </thead>
            <tbody>
              {renderStudentsRows()}
            </tbody>
          </table>
          <div className='space-bottom'></div>
        </div>
      )
    }
    const renderBody = () => {
      return (
        <div>
          <table className='table cart'>
            <thead>
              <tr>
                <th>상품명</th>
                <th>단가</th>
                <th>수량</th>
                <th className='amount'>합계</th>
              </tr>
            </thead>
            <tbody>
              {renderCartList()}
              {renderTotalAmount()}
              {renderPointForm()}
              {renderTotalPayment()}
            </tbody>
          </table>
          <div className='space-bottom'></div>
          {renderSenderInfo()}
          {renderReceiverInfo()}
          {renderStudentInfo()}
          <div className='text-right'>주문한 내역은 <Link to='/my-page/order-list'>마이페이지 > 구매목록</Link> 에서 다시 확인하실 수 있습니다.</div>
          <div className='text-right'>
            <Button
              onClick={() => this.context.router.push('/')}
              textComponent={<span><i className='fa fa-home' /> 메인화면으로</span>}
            />
          </div>
        </div>
      )
    }
    const renderMainContainer = () => {
      if (this.state.orderProcess) {
        return (
          <Loading text='결제정보를 처리중..' />
        )
      } else {
        return (
          <MainContainer
            title='주문완료'
            bodyComponent={renderBody()}
          />
        )
      }
    }
    return (
      <div>
        {orderTransaction && renderMainContainer()}
      </div>
    )
  }
}

OrderCompleteView.contextTypes = {
  router: PropTypes.object.isRequired
}

OrderCompleteView.propTypes = {
  orderTransaction: PropTypes.object,
  clearOrderTransaction: PropTypes.func.isRequired,
  location: PropTypes.object,
  fetchCartsByUserId: PropTypes.func,
  fetchUserByUserId: PropTypes.func,
  receiveOrderTransaction: PropTypes.func
}

export default OrderCompleteView
