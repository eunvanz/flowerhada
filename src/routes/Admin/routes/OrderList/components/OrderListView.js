import React from 'react'
import { convertSqlDateToStringDateOnly, assemblePhoneNumber } from 'common/util'
import numeral from 'numeral'
import keygen from 'keygenerator'
import Button from 'components/Button'
import $ from 'jquery'
import { updateOrder, cancelPayment } from 'common/OrderService'
import { updateUserPoint } from 'common/UserService'
import { putCart } from 'common/CartService'
import { postPointHistory } from 'common/PointHistoryService'

class OrderListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curPage: 0,
      perPage: 10,
      isLoading: false,
      transportCode: {},
      status: {},
      show: {},
      lastUpadatedField: '',
      showSaveButton: {},
      saveProcess: false
    }
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
    this._handleOnClickShowInfo = this._handleOnClickShowInfo.bind(this)
    this._handleOnClickSaveTransportCode = this._handleOnClickSaveTransportCode.bind(this)
    this._handleOnChangeTransportCode = this._handleOnChangeTransportCode.bind(this)
    this._handleOnClickSaveStatus = this._handleOnClickSaveStatus.bind(this)
    this._handleOnChangeStatus = this._handleOnChangeStatus.bind(this)
  }
  componentDidMount () {
    this.props.fetchOrders(0, 10)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevState.transportCode !== this.state.transportCode || prevState.status !== this.state.status) {
      $(`#${this.state.lastUpadatedField}`).focus()
    }
  }
  _handleOnClickMoreList () {
    this.setState({ curPage: this.state.curPage + 1, isLoading: true })
    this.props.fetchAndAppendMoreOrders(this.state.curPage + 1, this.state.perPage)
    .then(() => {
      this.setState({ isLoading: false })
    })
  }
  _handleOnClickShowInfo (id) {
    this.setState({ show: Object.assign({}, this.state.show, { [id]: this.state.show[id] ? !this.state.show[id] : true }) })
  }
  _handleOnChangeTransportCode (e) {
    const { id, value } = e.target
    this.setState({ transportCode: Object.assign({}, this.state.transportCode, { [id]: value }) })
    this.setState({ lastUpadatedField: id })
  }
  _handleOnClickSaveTransportCode (order) {
    order.transportCode = this.state.transportCode[order.id]
    updateOrder(order, order.id)
  }
  _handleOnChangeStatus (e) {
    const { id, value } = e.target
    this.setState({ status: Object.assign({}, this.state.status, { [id]: value }) })
    const originalOrder = this.props.orderList.content.filter(order => Number(id) === order.id)[0]
    if (originalOrder.status !== value) {
      this.setState({ showSaveButton: Object.assign({}, this.state.showSaveButton, { [id]: true }) })
    } else {
      this.setState({ showSaveButton: Object.assign({}, this.state.showSaveButton, { [id]: false }) })
    }
    this.setState({ lastUpadatedField: id })
  }
  _handleOnClickSaveStatus (order) {
    this.setState({ saveProcess: true })
    const status = this.state.status[order.id]
    const updatedOrder = Object.assign({}, order, { status })
    const cancelPaymentProcess = () => {
      if (status === '등록취소' || status === '주문취소') {
        return cancelPayment(order)
      } else {
        return Promise.resolve()
      }
    }
    cancelPaymentProcess()
    .then(() => {
      if (status === '수강완료' || status === '배송완료') {
        const proms = []
        const point = (order.pointSpent + order.totalAmount) * 0.01
        const pointHistory = { userId: order.userId, amount: point, action: status === '수강완료' ? '레슨 수강완료' : '구매완료' }
        proms.push(postPointHistory(pointHistory))
        return Promise.all(proms)
      } else if (status === '등록취소' || status === '주문취소') {
        const proms = []
        if (order.status === '수강완료' || order.status === '배송완료') {
          const point = (order.pointSpent + order.totalAmount) * 0.01 * -1
          const pointHistory = { userId: order.userId, amount: point, action: status === '등록취소' ? '수강취소' : '구매취소' }
          proms.push(postPointHistory(pointHistory))
        }
        return Promise.all(proms)
      } else {
        return Promise.resolve()
      }
    })
    .then(() => {
      return updateOrder(updatedOrder, order.id)
    })
    .then(() => {
      const carts = order.carts
      const proms = carts.map(cart => {
        const updatedCart = Object.assign({}, cart, { status, transDate: null })
        return putCart(updatedCart, cart.id)
      })
      return Promise.all(proms)
    })
    .then(() => {
      this.props.fetchOrders(0, (this.state.curPage + 1) * this.state.perPage)
      this.setState({ showSaveButton: Object.assign({}, this.state.showSaveButton, { [order.id]: false }),
        saveProcess: false })
    })
    .catch(() => {
      window.alert('오류가 발생했습니다.')
    })
  }
  render () {
    const renderProductTitles = order => {
      return order.carts.map(cart => {
        return (
          <span key={keygen._()}><a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickShowInfo(`orderInfo${order.id}`)}>{cart.lesson ? cart.lesson.title : cart.product.title}</a> <small>x {cart.quantity}</small><br /></span>
        )
      })
    }
    const renderMoreButton = () => {
      if (!this.props.orderList.last) {
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
                      {this.props.orderList.totalPages - 1 -
                      this.props.orderList.number === 1 ? this.props.orderList.totalElements -
                      (this.props.orderList.number + 1) * this.props.orderList.numberOfElements
                      : this.props.orderList.numberOfElements}</span>건 더 보기
                  </span>
                }
              />
            </td>
          </tr>
        )
      }
    }
    const renderStatusOptions = order => {
      const type = order.carts[0].lesson ? 'lesson' : 'product'
      let returnComponent = []
      if (type === 'lesson') {
        returnComponent = [
          <option key={keygen._()} value='등록접수'>등록접수</option>,
          <option key={keygen._()} value='등록완료'>등록완료</option>,
          <option key={keygen._()} value='등록취소'>등록취소</option>,
          <option key={keygen._()} value='수강완료'>수강완료</option>
        ]
      } else if (type === 'product') {
        returnComponent = [
          <option key={keygen._()} value='주문접수'>주문접수</option>,
          <option key={keygen._()} value='배송준비중'>배송준비중</option>,
          <option key={keygen._()} value='배송중'>배송중</option>,
          <option key={keygen._()} value='주문취소'>주문취소</option>,
          <option key={keygen._()} value='배송완료'>배송완료</option>,
          <option key={keygen._()} value='환불완료'>환불완료</option>
        ]
      }
      return returnComponent
    }
    const renderList = () => {
      const returnComponent = []
      for (const order of this.props.orderList.content) {
        returnComponent.push(
          <tr key={order.id}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(order.updateDate)}</td>
            <td>{renderProductTitles(order)}</td>
            <td className='text-center hidden-xs'>{numeral(order.pointSpent).format('0,0')}P</td>
            <td className='text-center hidden-xs'>{numeral(order.totalAmount - order.pointSpent).format('0,0')}원</td>
            <td className='text-center'>{order.status}</td>
            <td className='text-center'>{order.transportCode}</td>
          </tr>
        )
        returnComponent.push(
          <tr key={keygen._()} style={{ display: this.state.show[`orderInfo${order.id}`] ? this.state.show[`orderInfo${order.id}`] : 'none' }} id={`orderInfo${order.id}`}>
            <td colSpan={6}>
              <div>
                <form className='form-horizontal' role='form'>
                  <div className='form-group'>
                    <div className='col-sm-2'>ID</div>
                    <div className='col-sm-10'>{order.id}</div>
                  </div>
                  <div className='form-group'>
                    <div className='col-sm-2'>UID</div>
                    <div className='col-sm-10'>{order.uid}</div>
                  </div>
                  <div className='form-group'>
                    <div className='col-sm-2'>결재수단</div>
                    <div className='col-sm-10'>{order.paymentMethod}</div>
                  </div>
                  <div id={`userInfo${order.id}`}>
                    <div className='form-group'>
                      <div className='col-sm-2'>사용자이메일</div>
                      <div className='col-sm-10'>{order.user.email}</div>
                    </div>
                    <div className='form-group'>
                      <div className='col-sm-2'>사용자이름</div>
                      <div className='col-sm-10'>{order.user.name}</div>
                    </div>
                    <div className='form-group'>
                      <div className='col-sm-2'>사용자전화번호</div>
                      <div className='col-sm-10'>{order.user.phone}</div>
                    </div>
                    <div className='form-group'>
                      <div className='col-sm-2'>상태변경</div>
                      <div className='col-sm-10'>
                        <select className='form-control' id={order.id} style={{ width: '200px' }}
                          value={this.state.status[order.id] || this.state.status[order.id] === '' ? this.state.status[order.id] : order.status}
                          onChange={this._handleOnChangeStatus}>
                          {renderStatusOptions(order)}
                        </select>
                        {this.state.showSaveButton[order.id] &&
                          <Button
                            textComponent={<span>저장</span>}
                            onClick={() => this._handleOnClickSaveStatus(order)}
                            process={this.state.saveProcess}
                        />}
                      </div>
                    </div>
                  </div>
                  {
                    order.carts[0].product &&
                    <div>
                      <div>
                        <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickShowInfo(`transportInfo${order.id}`)}>배송정보 보기/닫기</a>
                      </div>
                      <div id={`transportInfo${order.id}`} style={{ display: this.state.show[`transportInfo${order.id}`] ? this.state.show[`transportInfo${order.id}`] : 'none' }}>
                        <div className='form-group'>
                          <div className='col-sm-2'>배송주소</div>
                          <div className='col-sm-10'>{`[${order.postCode}] ${order.address} ${order.restAddress}`}</div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>받는사람</div>
                          <div className='col-sm-10'>{order.receiver}</div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>받는사람 연락처</div>
                          <div className='col-sm-10'>{assemblePhoneNumber(JSON.parse(order.receiverPhoneNumber))}</div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>배송메시지</div>
                          <div className='col-sm-10'>{order.transportMessage}</div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>운송장번호</div>
                          <div className='col-sm-10'>
                            <input type='text' className='form-control' id={order.id}
                              value={this.state.transportCode[order.id] || this.state.transportCode[order.id] === '' ? this.state.transportCode[order.id] : order.transportCode}
                              onChange={this._handleOnChangeTransportCode} />
                            <Button
                              textComponent={<span>저장</span>}
                              onClick={() => this._handleOnClickSaveTransportCode(order)}
                            />
                          </div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>보내는사람</div>
                          <div className='col-sm-10'>{order.sender}</div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>편지추가</div>
                          <div className='col-sm-10' dangerouslySetInnerHTML={{ __html: order.letterMessage }}></div>
                        </div>
                      </div>
                      <div>
                        <a style={{ cursor: 'pointer' }}
                          onClick={() => this._handleOnClickShowInfo(`productInfo${order.id}`)}>상품정보 보기/닫기</a>
                      </div>
                      <div id={`productInfo${order.id}`} style={{ display: this.state.show[`productInfo${order.id}`] ? this.state.show[`productInfo${order.id}`] : 'none' }}>
                        {order.carts.map(cart => {
                          return (
                            <div key={keygen._()}>
                              <div className='form-group'>
                                <div className='col-sm-2'>상품명</div>
                                <div className='col-sm-10'>{cart.product.title}</div>
                              </div>
                              <div className='form-group'>
                                <div className='col-sm-2'>옵션</div>
                                <div className='col-sm-10'>
                                  {JSON.parse(cart.options).map(option => {
                                    if (option.name !== '선택안함') {
                                      return <span key={keygen._()}>{option.name}<br /></span>
                                    }
                                  })}
                                </div>
                              </div>
                              <div className='form-group'>
                                <div className='col-sm-2'>수량</div>
                                <div className='col-sm-10'>{cart.quantity}</div>
                              </div>
                              {
                                cart.product.deliveryType === '퀵' &&
                                <div className='form-group'>
                                  <div className='col-sm-2'>퀵 주문 정보</div>
                                  <div className='col-sm-10'>{cart.product.receiveDate} {cart.product.receiveTime} {cart.product.receiveArea}</div>
                                </div>
                              }
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                  {
                    order.carts[0].lesson &&
                    <div>
                      <div>
                        <a style={{ cursor: 'pointer' }} onClick={() => this._handleOnClickShowInfo(`studentsInfo${order.id}`)}>수강생정보 보기/닫기</a>
                      </div>
                      <div id={`studentsInfo${order.id}`} style={{ display: this.state.show[`studentsInfo${order.id}`] ? this.state.show[`studentsInfo${order.id}`] : 'none' }}>
                        <div className='form-group'>
                          <div className='col-sm-2'>수강생 이름</div>
                          <div className='col-sm-10'>{JSON.parse(order.studentNames).map(studentName => {
                            return <span>{studentName}<br /></span>
                          })}
                          </div>
                        </div>
                        <div className='form-group'>
                          <div className='col-sm-2'>수강생 연락처</div>
                          <div className='col-sm-10'>{JSON.parse(order.studentPhoneNumbers).map(phoneNumber => {
                            return <span>{assemblePhoneNumber(phoneNumber)}<br /></span>
                          })}
                          </div>
                        </div>
                      </div>
                      <div>
                        <a style={{ cursor: 'pointer' }}
                          onClick={() => this._handleOnClickShowInfo(`lessonInfo${order.id}`)}>레슨정보 보기/닫기</a>
                      </div>
                      <div id={`lessonInfo${order.id}`} style={{ display: this.state.show[`lessonInfo${order.id}`] ? this.state.show[`lessonInfo${order.id}`] : 'none' }}>
                        {order.carts.map(cart => {
                          return (
                            <div key={keygen._()}>
                              <div className='form-group'>
                                <div className='col-sm-2'>강좌명</div>
                                <div className='col-sm-10'>{cart.lesson.title}</div>
                              </div>
                              <div className='form-group'>
                                <div className='col-sm-2'>시간</div>
                                <div className='col-sm-10'>[{cart.lesson.lessonDate}] {cart.lesson.startTime} ~ {cart.lesson.endTime}</div>
                              </div>
                              <div className='form-group'>
                                <div className='col-sm-2'>수량</div>
                                <div className='col-sm-10'>{cart.quantity}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                </form>
              </div>
            </td>
          </tr>
        )
      }
      return returnComponent
    }
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th className='text-center'>날짜</th>
              <th className='text-center'>상품명</th>
              <th className='text-center'>사용포인트</th>
              <th className='text-center'>결제금액</th>
              <th className='text-center'>상태</th>
              <th className='text-center'>운송장번호</th>
            </tr>
          </thead>
          <tbody>
            {this.props.orderList && this.props.orderList.content.length > 0 && renderList()}
            {this.props.orderList && renderMoreButton()}
          </tbody>
        </table>
      </div>
    )
  }
}

OrderListView.propTypes = {
  orderList: React.PropTypes.object,
  fetchOrders: React.PropTypes.func.isRequired,
  fetchAndAppendMoreOrders: React.PropTypes.func.isRequired,
  authUser: React.PropTypes.object
}

export default OrderListView
