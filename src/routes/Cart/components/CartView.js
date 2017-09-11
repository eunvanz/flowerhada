import React, { PropTypes } from 'react'
import keygen from 'keygenerator'
import { Link } from 'react-router'
import Button from 'components/Button'
import TextField from 'components/TextField'
import numeral from 'numeral'
import { deleteCartById } from 'common/CartService'
import LessonDateInfo from 'components/LessonDateInfo'
import { postOrderTransaction, cancelPayment } from 'common/OrderService'
import { Tooltip } from 'react-bootstrap'
import Alert from 'components/Alert'
import { dividePhoneNumber, assemblePhoneNumber, isIE } from 'common/util'
import MessageModal from 'components/MessageModal'
import PhoneNumberInput from 'components/PhoneNumberInput'
import CustomModal from 'components/CustomModal'
import { getAddressHistoryByUserId } from 'common/AddressHistoryService'
import { updateUser } from 'common/UserService'
import { postError } from 'common/ErrorService'

class CartView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      quantity: '',
      mode: '',
      pointSpent: 0,
      receiver: '',
      receiverPhoneNumber: ['010', '', ''],
      senderPhoneNumber: this.props.user && this.props.user.phone ? dividePhoneNumber(this.props.user.phone) : ['010', '', ''],
      postCode: '',
      address: '',
      restAddress: '',
      studentNames: [],
      studentPhoneNumbers: [],
      sender: this.props.user ? this.props.user.name : '',
      letterMessage: '',
      transportMessage: '',
      paymentMethod: 'card',
      validateText: '',
      messageModal: { show: false, message: '' },
      showRecentAddress: false,
      recentAddress: [],
      same: false,
      orderProcess: false,
      anonymous: false,
      savePhoneNumber: false
    }
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._handleOnChangeQuantity = this._handleOnChangeQuantity.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickCheckout = this._handleOnClickCheckout.bind(this)
    this._handleOnChangePointSpent = this._handleOnChangePointSpent.bind(this)
    this._getTotalPrice = this._getTotalPrice.bind(this)
    this._initialize = this._initialize.bind(this)
    this._handleOnChangeReceiverPhoneNumber = this._handleOnChangeReceiverPhoneNumber.bind(this)
    this._handleOnChangeSenderPhoneNumber = this._handleOnChangeSenderPhoneNumber.bind(this)
    this._handleOnCLickFold = this._handleOnCLickFold.bind(this)
    this._handleOnClickPostCode = this._handleOnClickPostCode.bind(this)
    this._handleOnChangeStudentName = this._handleOnChangeStudentName.bind(this)
    this._handleOnChangeStudentPhoneNumber = this._handleOnChangeStudentPhoneNumber.bind(this)
    this._isValid = this._isValid.bind(this)
    this._hideMessageModal = this._hideMessageModal.bind(this)
    this._showMessageModal = this._showMessageModal.bind(this)
    this._showRecentAddress = this._showRecentAddress.bind(this)
    this._hideRecentAddress = this._hideRecentAddress.bind(this)
    this._handleOnChangeSameReceiver = this._handleOnChangeSameReceiver.bind(this)
    this._handleOnClickAddress = this._handleOnClickAddress.bind(this)
  }
  componentDidMount () {
    const { user, carts, fetchCartsByUserId, orderItem } = this.props
    const { type } = this.props.params
    if (!user) {
      this.context.router.push('/login')
      return
    }
    if (type !== 'direct' && !carts) {
      fetchCartsByUserId(user.id)
      .then(() => {
        this._initialize()
      })
    } else if (type === 'direct') {
      if (!orderItem) {
        this.context.router.push('/not-found')
        return
      }
      this._initialize()
    }
    this._initialize()
    window.IMP.init('imp00642478')
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.type !== this.props.params.type) {
      this._initialize()
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    // if (nextProps.carts && nextProps.carts.length < 1 && this.props.params.type !== 'direct') return false
    return true
  }
  _initialize () {
    const { type } = this.props.params
    const { orderItem, carts, user } = this.props
    let quantity = 1
    let mode = '장바구니'
    if (type === 'saved' || type === 'checkout') {
      quantity = carts ? carts.map(cart => cart.quantity.toString()) : new Array(0)
      if (type === 'checkout') mode = '주문하기'
    } else if (type === 'direct') {
      quantity = [orderItem.quantity.toString()]
      mode = '주문하기'
    } else {
      this.context.router.push('/not-found')
    }
    let studentNames = []
    let studentPhoneNumbers = []
    for (let i = 0; i < quantity; i++) {
      if (i === 0) {
        studentNames.push(this.props.user ? this.props.user.name : '')
        studentPhoneNumbers.push(this.props.user && this.props.user.phone ? dividePhoneNumber(this.props.user.phone) : ['010', '', ''])
      } else {
        studentNames.push('')
        studentPhoneNumbers.push(['010', '', ''])
      }
    }
    const senderPhoneNumber = this.props.user && this.props.user.phone ? dividePhoneNumber(this.props.user.phone) : ['010', '', '']
    // 최근 주소 리스트 가지고 오기
    getAddressHistoryByUserId(user.id)
    .then(res => {
      const recentAddress = res.data
      this.setState({ quantity, mode, studentNames, studentPhoneNumbers, senderPhoneNumber, recentAddress })
    })
  }
  _handleOnClickDelete (e) {
    const id = e.target.id
    deleteCartById(id)
    .then(() => {
      this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  _handleOnChangeQuantity (e) {
    let { id, value } = e.target
    if (value <= 0) value = 1
    const quantity = this.state.quantity
    quantity[id] = value.toString()
    this.setState({ quantity })
  }
  _handleOnChangeInput (e) {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }
  _handleOnChangePointSpent (e) {
    let { value } = e.target
    if (value < 0) value = 0
    else if (value > this.props.user.point) value = this.props.user.point
    this.setState({ pointSpent: value })
  }
  _handleOnClickCheckout () {
    if (this.state.mode === '장바구니') {
      this.setState({ mode: '주문하기' })
    } else {
      this.setState({ orderProcess: true })
      const { carts, orderItem } = this.props
      const { type } = this.props.params
      let items = Object.assign({}, carts)
      if (type === 'direct') items = [orderItem]
      const title = `${items[0].lesson ? items[0].lesson.title : items[0].product.title}${items.length > 1 ? `외 ${items.length - 1}건` : ''}` // eslint-disable-line

      let orderTransaction = {}
      orderTransaction.userId = this.props.user.id

      // Order post
      const order = {}
      order.paymentMethod = this.state.paymentMethod
      order.pointSpent = this.state.pointSpent
      order.totalAmount = this._getTotalPrice() - this.state.pointSpent
      order.userId = this.props.user.id
      order.status = items[0].product ? '주문접수' : '등록접수'
      if (items[0].product) {
        order.receiver = this.state.receiver
        order.receiverPhoneNumber = JSON.stringify(this.state.receiverPhoneNumber)
        order.postCode = this.state.postCode
        order.address = this.state.address
        order.restAddress = this.state.restAddress
        order.sender = this.state.sender
        order.senderPhoneNumber = JSON.stringify(this.state.senderPhoneNumber)
        order.letterMessage = this.state.letterMessage.replace(/\n/g, '<br>')
        order.transportMessage = this.state.transportMessage
      } else {
        order.studentNames = JSON.stringify(this.state.studentNames)
        order.studentPhoneNumbers = JSON.stringify(this.state.studentPhoneNumbers)
      }
      orderTransaction.order = order

      // cart status 및 type 변경
      if (type === 'checkout' || type === 'saved') {
        orderTransaction.cartUpdateType = 'update'
        // 장바구니의 type과 status 변경
        let idx = 0
        let cartsForOrderTransaction = []
        this.props.carts.forEach(cart => {
          // const updatedCart = Object.assign({}, cart)
          const updatedCart = {}
          updatedCart.userId = cart.userId
          if (cart.lessonId) {
            updatedCart.lessonId = cart.lessonId
            updatedCart.lesson = Object.assign({}, cart.lesson)
            updatedCart.lesson.regDateTime = null
          } else {
            updatedCart.productId = cart.productId
            updatedCart.receiveDate = cart.receiveDate
            updatedCart.receiveTime = cart.receiveTime
            updatedCart.receiveArea = cart.receiveArea
            updatedCart.product = Object.assign({}, cart.product)
            updatedCart.product.regDateTime = null
          }
          updatedCart.quantity = this.state.quantity[idx]
          updatedCart.type = '구매목록'
          updatedCart.status = cart.LessonId ? '등록접수' : '주문접수'
          updatedCart.options = cart.options
          updatedCart.totalAmount = cart.itemPrice * this.state.quantity[idx++]
          updatedCart.itemPrice = cart.itemPrice
          updatedCart.id = cart.id
          cartsForOrderTransaction.push(updatedCart)
        })
        orderTransaction = Object.assign({}, orderTransaction, { carts: cartsForOrderTransaction })
      } else if (type === 'direct') {
        // orderItem을 cart에 등록
        orderTransaction.cartUpdateType = 'create'
        const { orderItem } = this.props
        const cart = {}
        cart.userId = this.props.user.id
        if (orderItem.lessonId) {
          cart.lessonId = orderItem.lessonId
          cart.lesson = Object.assign({}, orderItem.lesson)
          cart.lesson.regDateTime = null
        } else {
          cart.productId = orderItem.productId
          cart.receiveDate = orderItem.receiveDate
          cart.receiveTime = orderItem.receiveTime
          cart.receiveArea = orderItem.receiveArea
          cart.product = Object.assign({}, orderItem.product)
          cart.product.regDateTime = null
        }
        cart.quantity = this.state.quantity[0]
        cart.type = '구매목록'
        cart.status = orderItem.LessonId ? '등록접수' : '주문접수'
        cart.options = orderItem.options
        cart.totalAmount = orderItem.itemPrice * this.state.quantity
        cart.itemPrice = orderItem.itemPrice
        orderTransaction = Object.assign({}, orderTransaction, { carts: [cart] })
      }

      // 최근배송주소 저장
      if (items[0].product) {
        const { recentAddress } = this.state
        // 최근배송주소에서 배송지를 선택했을 경우 선택한 배송지의 사용일자를 기록
        const address = recentAddress.filter(address =>
          address.address === this.state.address && address.restAddress === this.state.restAddress)
        if (address.length > 0) {
          orderTransaction.addressUpdateType = 'update'
          const addressHistory = {}
          addressHistory.userId = this.props.user.id
          addressHistory.postCode = address[0].postCode
          addressHistory.address = address[0].address
          addressHistory.restAddress = address[0].restAddress
          addressHistory.id = address[0].id
          orderTransaction.addressHistory = addressHistory
        } else {
          orderTransaction.addressUpdateType = 'create'
          const addressHistory = {}
          addressHistory.userId = this.props.user.id
          addressHistory.postCode = this.state.postCode
          addressHistory.address = this.state.address
          addressHistory.restAddress = this.state.restAddress
          orderTransaction.addressHistory = addressHistory
        }
      }

      // 포인트 사용내역 기록
      if (this.state.pointSpent > 0) {
        const spentPointHistory = {}
        spentPointHistory.userId = this.props.user.id
        spentPointHistory.amount = this.state.pointSpent * -1
        spentPointHistory.action = '상품구매사용'
        orderTransaction.spentPointHistory = spentPointHistory
      }

      this.props.receiveOrderTransaction(orderTransaction)

      if (this._isValid()) {
        // 휴대폰번호 저장
        if (this.state.savePhoneNumber) {
          const user = Object.assign({}, this.props.user, { phone: this.props.orderItem.product ? assemblePhoneNumber(this.state.senderPhoneNumber) : assemblePhoneNumber(this.state.studentPhoneNumbers[0]), regDate: null })
          updateUser(user)
        }
        const orderTransactionForQuery = Object.assign({}, orderTransaction)
        // orderTransactionForQuery.order.address = ''
        // orderTransactionForQuery.order.restAddress = ''
        for (let i = 0; i < orderTransactionForQuery.carts.length; i++) {
          if (orderTransactionForQuery.carts[i].product) {
            orderTransactionForQuery.carts[i].product.content = ''
            // orderTransactionForQuery.carts[i].product.title = ''
            orderTransactionForQuery.carts[i].product.detail = ''
            orderTransactionForQuery.carts[i].product.groupName = ''
          } else {
            orderTransactionForQuery.carts[i].lesson.content = ''
            // orderTransactionForQuery.carts[i].lesson.title = ''
            orderTransactionForQuery.carts[i].lesson.detail = ''
            orderTransactionForQuery.carts[i].lesson.groupName = ''
          }
        }
        const settings = {
          pg: isIE() ? 'inicis' : 'html5_inicis',
          pay_method: this.state.paymentMethod,
          merchant_uid: 'merchant_' + new Date().getTime(),
          name: title,
          display: { card_quota: [2, 3] }, // 선택가능한 할부개월 표시
          amount: this._getTotalPrice() - this.state.pointSpent,
          buyer_name: this.props.user.name,
          buyer_email: this.props.user.email,
          buyer_tel: this.props.user.phone ? assemblePhoneNumber(this.props.user.phone) : this.props.orderItem.product ? assemblePhoneNumber(this.state.senderPhoneNumber) : assemblePhoneNumber(this.state.studentPhoneNumbers[0]),
          m_redirect_url: `http://flowerhada.com/order-complete?order_transaction=${JSON.stringify(orderTransactionForQuery)}`
        }
        const view = this
        window.IMP.request_pay(settings, function (rsp) {
          if (rsp.success) {
            orderTransaction.order.uid = rsp.imp_uid
            if (view.state.paymentMethod === 'card') {
              orderTransaction.order.applyNum = rsp.apply_num
            } else if (view.state.paymentMethod === 'vbank') {
              orderTransaction.order.vbankNum = rsp.vbank_num
              orderTransaction.order.vbankName = rsp.vbank_name
              orderTransaction.order.vbankHolder = rsp.vbank_holder
              orderTransaction.order.vbankDate = rsp.vbank_date
            }
            postOrderTransaction(orderTransaction)
            .then(() => {
              return view.props.fetchCartsByUserId(view.props.user.id)
            })
            .then(() => {
              return view.props.fetchUser(view.props.user.id)
            })
            .then(() => {
              view.context.router.push('/order-complete')
            })
            .catch(() => {
              const error = {
                type: '결제후처리에러',
                log: JSON.stringify(orderTransaction),
                userId: view.props.user.id,
                status: '미해결'
              }
              postError(error)
              .then(() => {
                return cancelPayment(orderTransaction.order)
              })
              .then((res) => {
                view.setState({ orderProcess: false })
                alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
              })
            })
          } else {
            view.setState({ orderProcess: false })
            view._showMessageModal('결제에 실패했습니다. - ' + rsp.error_msg + '.')
          }
        })
      }
    }
  }
  _getTotalPrice () {
    const { carts, orderItem } = this.props
    const { type } = this.props.params
    let items = carts
    if (type === 'direct') items = [orderItem]
    let seq = 0
    return items.reduce((acc, cart) => {
      return acc + cart.itemPrice * this.state.quantity[seq++]
    }, 0)
  }
  _handleOnChangeReceiverPhoneNumber (e) {
    const { value } = e.target
    const { index } = e.target.dataset
    let { receiverPhoneNumber } = this.state
    receiverPhoneNumber[index] = value
    this.setState({ receiverPhoneNumber })
  }
  _handleOnChangeSenderPhoneNumber (e) {
    const { value } = e.target
    const { index } = e.target.dataset
    let { senderPhoneNumber } = this.state
    senderPhoneNumber[index] = value
    this.setState({ senderPhoneNumber })
  }
  _handleOnChangeStudentName (e) {
    const { value } = e.target
    const { index } = e.target.dataset
    let { studentNames } = this.state
    studentNames[index] = value
    this.setState({ studentNames })
  }
  _handleOnChangeStudentPhoneNumber (e) {
    const { value } = e.target
    const { index, seq } = e.target.dataset
    let { studentPhoneNumbers } = this.state
    studentPhoneNumbers[seq][index] = value
    this.setState({ studentPhoneNumbers })
  }
  _handleOnCLickFold () {
    const postWrapper = document.getElementById('postWrapper')
    postWrapper.style.display = 'none'
  }
  _handleOnClickPostCode () {
    const postWrapper = document.getElementById('postWrapper')
    const postCode = document.getElementById('postCode')
    const address = document.getElementById('address')
    const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
    const view = this
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let fullAddr = data.address // 최종 주소 변수
        let extraAddr = '' // 조합형 주소 변수

        // 기본 주소가 도로명 타입일때 조합한다.
        if (data.addressType === 'R') {
          // 법정동명이 있을 경우 추가한다.
          if (data.bname !== '') {
            extraAddr += data.bname
          }
          // 건물명이 있을 경우 추가한다.
          if (data.buildingName !== '') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName)
          }
          // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
          fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '')
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        postCode.value = data.zonecode // 5자리 새우편번호 사용
        address.value = fullAddr

        // iframe을 넣은 element를 안보이게 한다.
        // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
        postWrapper.style.display = 'none'

        // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
        document.body.scrollTop = currentScroll
        view.setState({ postCode: postCode.value, address: address.value })
      },
      // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
      onresize: function (size) {
        postWrapper.style.height = size.height + 'px'
      },
      width: '100%',
      height: '100%'
    }).embed(postWrapper)

    // iframe을 넣은 element를 보이게 한다.
    postWrapper.style.display = 'block'
  }
  _isValid () {
    const { type } = this.props.params
    const { carts, orderItem } = this.props
    const items = type === 'direct' ? [orderItem] : carts
    this.setState({ orderProcess: false })
    if (items[0].product) {
      if (this.state.receiver.length === 0) {
        this.setState({ validateText: '수신인 이름을 입력해주세요.' })
      } else if (this.state.receiverPhoneNumber.length === 0) {
        this.setState({ validateText: '수신인 전화번호를 입력해주세요.' })
      } else if (this.state.postCode.length === 0) {
        this.setState({ validateText: '배송지 주소를 입력해주세요.' })
      } else if (this.state.restAddress.length === 0) {
        this.setState({ validateText: '배송지 나머지주소를 입력해주세요.' })
      } else {
        this.setState({ validateText: '' })
        return true
      }
    } else if (items[0].lesson) {
      if (this.state.studentNames.some(name => name.length === 0)) {
        this.setState({ validateText: `수강생 이름을 ${this.state.studentNames.length > 1 ? '전부 ' : ''} 입력해주세요.` })
      } else if (this.state.studentPhoneNumbers.some(number => number.some(sub => sub.length === 0))) {
        this.setState({ validateText: `수강생 연락처를 ${this.state.studentNames.length > 1 ? '전부 ' : ''} 입력해주세요.` })
      } else {
        this.setState({ validateText: '' })
        return true
      }
    }
    return false
  }
  _hideMessageModal () {
    this.setState({ messageModal: Object.assign({}, this.state.messageModal, { show: false }) })
  }
  _showMessageModal (message) {
    this.setState({ messageModal: { show: true, message } })
  }
  _showRecentAddress () {
    this.setState({ showRecentAddress: true })
  }
  _hideRecentAddress () {
    this.setState({ showRecentAddress: false })
  }
  _handleOnClickAddress (e) {
    e.preventDefault()
    const { id } = e.target.dataset
    const address = this.state.recentAddress.filter(address => address.id == id)[0] // eslint-disable-line
    this.setState({
      postCode: address.postCode,
      address: address.address,
      restAddress: address.restAddress,
      showRecentAddress: false
    })
  }
  _handleOnChangeSameReceiver () {
    this.setState({ same: !this.state.same })
    if (this.state.same) {
      this.setState({ receiver: '', receiverPhoneNumber: ['010', '', ''] })
    } else {
      this.setState({
        receiver: this.props.user.name,
        receiverPhoneNumber: this.props.user.phone ? dividePhoneNumber(this.props.user.phone) : ['010', '', ''],
        sender: this.props.user.name,
        senderPhoneNumber: this.props.user.phone ? dividePhoneNumber(this.props.user.phone) : ['010', '', '']
      })
    }
  }
  render () {
    const { carts, user, orderItem } = this.props
    const { type } = this.props.params
    const items = type === 'direct' ? [orderItem] : carts
    const isEmpty = () => {
      return !items || items.length === 0 || items[0] === null
    }
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
            {((optionsArray[seq].name !== '선택안함') && (seq !== optionsArray.length - 1)) || (cart.receiveDate || cart.receiveArea) ? ' / ' : ''}
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
      let seq = 0
      if (!items || items.length === 0 || items[0] === null) {
        return <tr>
          <td colSpan='5' className='text-center'>
            <div style={{ margin: '20px' }}><i className='fa fa-exclamation-triangle' /> 장바구니가 비어있습니다.</div>
          </td>
        </tr>
      }
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
            <td className='quantity'>
              <TextField type='number' id={seq.toString()} disabled={this.state.mode !== '장바구니'}
                value={this.state.quantity[seq] || 1} onChange={this._handleOnChangeQuantity} />
            </td>
            <td className='remove'>
              {this.state.mode === '장바구니' &&
                <Button size='sm' onClick={this._handleOnClickDelete} id={`${cart.id}`}
                  textComponent={<span id={cart.id}>삭제</span>}
                  disabled={this.state.mode !== '장바구니'} />
              }
            </td>
            <td className='amount'>￦{numeral(cart.itemPrice * this.state.quantity[seq++]).format('0,0')}</td>
          </tr>
        )
      })
    }
    const renderTotalAmount = () => {
      if (!isEmpty()) {
        return (
          <tr>
            <td className='total-quantity' colSpan='4'>
              총 <span className={this.state.mode === '장바구니' ? 'text-default' : null}>{items.length}</span>개의 아이템
            </td>
            <td className='total-amount'>
              ￦<span className={this.state.mode === '장바구니' ? 'text-default' : null}>{`${numeral(this._getTotalPrice()).format('0,0')}`}</span>
            </td>
          </tr>
        )
      }
    }
    const renderPointForm = () => {
      if (isEmpty()) return null
      return (
        <tr>
          <td className='total-quantity' colSpan='3'>
            포인트 사용
            <Tooltip placement='right' className='in' id='availablePoint' style={{ display: 'inline', zIndex: '99' }}>
              보유포인트 <span className='text-default'>{numeral(user.point).format('0,0')}P</span>
            </Tooltip>
          </td>
          <td colSpan='2' className='form-inline text-right'>
            <input
              id='pointSpent'
              type='number'
              step={100}
              style={{ width: '80px', paddingRight: '5px', paddingLeft: '5px' }}
              value={this.state.pointSpent}
              onChange={this._handleOnChangePointSpent}
            /> P
          </td>
        </tr>
      )
    }
    const renderTotalPayment = () => {
      if (isEmpty()) return null
      return (
        <tr>
          <td className='total-quantity' colSpan='4'>
            총 결제금액
          </td>
          <td className='total-amount' colSpan='2'>
            ￦<span className='text-default'>{numeral(this._getTotalPrice() - this.state.pointSpent).format('0,0')}</span>
          </td>
        </tr>
      )
    }
    const renderButtons = () => {
      if (!isEmpty()) {
        return (
          <div className='text-right'>
            <Button
              color='gray'
              onClick={this.context.router.goBack}
              textComponent={<span>돌아가기</span>}
              style={{ marginRight: '5px' }}
            />
            <Button
              color='dark'
              animated
              onClick={this._handleOnClickCheckout}
              process={this.state.orderProcess}
              textComponent={<span>{this.state.mode === '장바구니' ? '주문하기' : '결제하기'} <i className={this.state.mode === '장바구니' ? 'fa fa-pencil-square-o' : 'fa fa-credit-card-alt'} /></span>}
            />
          </div>
        )
      }
    }
    const renderAddressList = () => {
      return this.state.recentAddress.map(address => {
        return (
          <li key={keygen._()}>
            <a href='' onClick={this._handleOnClickAddress} data-id={address.id}>
              {`${address.address} ${address.restAddress}`}
            </a>
          </li>
        )
      })
    }
    const renderReceiverForm = () => {
      if (items[0] && items[0].product) {
        return (
          <div className='row'>
            <div className='col-lg-3'>
              <h3 className='title'>받으시는 분 정보</h3>
            </div>
            <div className='col-lg-8 col-lg-offset-1'>
              <div className='form-group'>
                <label htmlFor='receiver' className='col-md-2 control-label'>
                  수신인 이름<small className='text-default'>*</small>
                </label>
                <div className='col-md-10 form-inline'>
                  <input type='text' className='form-control' id='receiver' placeholder='실명을 입력해주세요.'
                    value={this.state.receiver} onChange={this._handleOnChangeInput} />
                  <label style={{ marginLeft: '5px' }}>
                    <input type='checkbox' checked={this.state.same} id='same'
                      onChange={this._handleOnChangeSameReceiver} /> <label htmlFor='same'>발신인과 동일</label>
                  </label>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='receiver' className='col-md-2 control-label'>
                  수신인 연락처<small className='text-default'>*</small>
                </label>
                <div className='col-md-10 form-inline'>
                  <PhoneNumberInput
                    valueStart={this.state.receiverPhoneNumber[0]}
                    valueMid={this.state.receiverPhoneNumber[1]}
                    valueEnd={this.state.receiverPhoneNumber[2]}
                    onChange={this._handleOnChangeReceiverPhoneNumber}
                  />
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='receiver' className='col-md-2 control-label'>
                  배송지 주소<small className='text-default'>*</small>
                </label>
                <div className='col-md-10 form-inline'>
                  <input type='text' className='form-control'
                    id='postCode' placeholder='우편번호' style={{ marginRight: '3px' }}
                    readOnly value={this.state.postCode} />
                  <button type='button' className='btn btn-default' id='searchPostCodeBtn'
                    onClick={this._handleOnClickPostCode}>우편번호찾기</button>
                  { this.state.recentAddress.length > 0 &&
                    <Button link textComponent={<span>최근배송지에서 선택</span>} onClick={this._showRecentAddress} />
                  }
                  <br />
                  <div id='postWrapper'
                    style={{ display: 'none', border: '1px solid', maxWidth: window.innerWidth, height: '300px', margin: '5px 0', position: 'relative' }}
                  >
                    <img src='//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png' id='btnFoldWrap'
                      style={{ cursor: 'pointer', position: 'absolute', right: '0px', top: '-1px', zIndex: '1' }}
                      onClick={this._handleOnCLickFold}
                      alt='접기버튼' />
                  </div>
                  { this.state.recentAddress.length > 0 &&
                    <CustomModal
                      title='최근배송지'
                      show={this.state.showRecentAddress}
                      bodyComponent={<nav>
                        <ul className='nav nav-pills nav-stacked list-style-icons'>{renderAddressList()}</ul>
                      </nav>}
                      footerComponent={<div className='pull-right'>
                        <Button textComponent={<span>닫기</span>} onClick={this._hideRecentAddress} color='dark' />
                      </div>}
                      close={this._hideRecentAddress}
                      width='400px'
                      id={keygen._()}
                    />
                  }
                  <input type='text' className='form-control'
                    id='address' placeholder='주소' style={{ width: '100%' }} readOnly value={this.state.address} />
                  <input type='text' className='form-control' onChange={this._handleOnChangeInput}
                    id='restAddress' placeholder='나머지주소' value={this.state.restAddress} style={{ width: '100%', marginTop: '5px' }} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
    const renderEachStudentForm = () => {
      const iteration = this.state.quantity
      const returnComponent = []
      for (let i = 0; i < iteration; i++) {
        returnComponent.push(
          <div key={i}>
            <div className='form-group'>
              <label htmlFor={`studentNames`} className='col-md-3 control-label'>
                수강생 이름{iteration > 1 ? ` #${i + 1}` : ''}<small className='text-default'>*</small>
              </label>
              <div className='col-md-4'>
                <input type='text' className='form-control' id={`studentNames`} data-index={i} placeholder='실명을 입력해주세요.'
                  value={this.state.studentNames[i]} onChange={this._handleOnChangeStudentName} />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor={`studentPhoneNumbers`} className='col-md-3 control-label'>
                수강생 연락처{iteration > 1 ? ` #${i + 1}` : ''}<small className='text-default'>*</small>
              </label>
              <div className='col-md-9 form-inline'>
                <PhoneNumberInput
                  valueStart={this.state.studentPhoneNumbers[i][0]}
                  valueMid={this.state.studentPhoneNumbers[i][1]}
                  valueEnd={this.state.studentPhoneNumbers[i][2]}
                  onChange={this._handleOnChangeStudentPhoneNumber}
                  seq={i}
                />
                {i === 0 && !this.props.user.phone &&
                  <p style={{ marginTop: '5px', marginLeft: '5px' }}>
                    <input type='checkbox' checked={this.state.savePhoneNumber} id='save-default'
                      onChange={() => this.setState({ savePhoneNumber: !this.state.savePhoneNumber })} /> <label htmlFor='save-default'> 내 휴대폰번호로 등록</label>
                  </p>
                }
              </div>
            </div>
          </div>
        )
      }
      return returnComponent
    }
    const renderStudentsForm = () => {
      if (items[0] && items[0].lesson) {
        return (
          <div className='row'>
            <div className='col-lg-3'>
              <h3 className='title'>수강생 정보</h3>
            </div>
            <div className='col-lg-8 col-lg-offset-1'>
              {renderEachStudentForm()}
            </div>
          </div>
        )
      }
    }
    const renderMessageForm = () => {
      if (items.some(item => {
        return item.options.indexOf('편지추가') > -1
      })) {
        return (
          <div className='form-group'>
            <label htmlFor='letterMessage' className='col-md-2 control-label'>
              편지 내용
            </label>
            <div className='col-md-10'>
              <textarea id='letterMessage' className='form-control' rows='8'
                value={this.state.letterMessage} onChange={this._handleOnChangeInput}
                data-limit={1000} />
              <div className='text-right small'>
                (<span className='text-default'>{this.state.letterMessage.length}</span>/1000)
              </div>
            </div>
          </div>
        )
      }
    }
    const renderSenderForm = () => {
      if (items[0] && items[0].product) {
        return (
          <div className='row'>
            <div className='col-lg-3'>
              <h3 className='title'>보내시는 분 정보</h3>
            </div>
            <div className='col-lg-8 col-lg-offset-1'>
              <div className='form-group'>
                <label htmlFor='sender' className='col-md-2 control-label'>
                  발신인 이름
                </label>
                <div className='col-md-10 form-inline'>
                  <input type='text' className='form-control' id='sender'
                    value={this.state.anonymous ? '익명' : this.state.sender} onChange={this._handleOnChangeInput} />
                  <input type='checkbox' checked={this.state.anonymous} style={{ marginLeft: '5px' }} id='anonymous'
                    onChange={() => this.setState({ anonymous: !this.state.anonymous })} /> <label htmlFor='anonymous'>익명으로 보내기</label>
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='sender' className='col-md-2 control-label'>
                  발신인 연락처<small className='text-default'>*</small>
                </label>
                <div className='col-md-9 form-inline'>
                  <select className='form-control' data-index={0} style={{ width: '80px', display: 'inline' }}
                    value={this.state.senderPhoneNumber[0]} onChange={this._handleOnChangeSenderPhoneNumber}>
                    <option value='010'>010</option>
                    <option value='011'>011</option>
                    <option value='016'>016</option>
                    <option value='017'>017</option>
                    <option value='018'>018</option>
                    <option value='019'>019</option>
                  </select>-
                  <input type='text' className='form-control' data-index={1} style={{ width: '80px', display: 'inline' }}
                    maxLength='4' pattern='[0-9]{4}'
                    value={this.state.senderPhoneNumber[1]} onChange={this._handleOnChangeSenderPhoneNumber} />-
                  <input type='text' className='form-control' data-index={2} style={{ width: '80px', display: 'inline' }}
                    maxLength='4' pattern='[0-9]{4}'
                    value={this.state.senderPhoneNumber[2]} onChange={this._handleOnChangeSenderPhoneNumber} />
                  {
                    !this.props.user.phone &&
                    <p style={{ marginTop: '5px', marginLeft: '5px' }}>
                      <input type='checkbox' checked={this.state.savePhoneNumber} id='save-default'
                        onChange={() => this.setState({ savePhoneNumber: !this.state.savePhoneNumber })} /> <label htmlFor='save-default'> 내 휴대폰번호로 등록</label>
                    </p>
                  }
                </div>
              </div>
              {renderMessageForm()}
            </div>
          </div>
        )
      }
    }
    const renderBillingInfo = () => {
      if (this.state.mode === '주문하기') {
        return (
          <div>
            <div className='space-bottom'></div>
            <fieldset>
              <legend>주문정보</legend>
              <form role='form' className='form-horizontal' id='billing-information'>
                {renderReceiverForm()}
                {renderStudentsForm()}
                {renderSenderForm()}
              </form>
            </fieldset>
          </div>
        )
      }
    }
    const renderPaymentInfo = () => {
      if (this.state.mode === '장바구니') return
      return (
        <div>
          <div className='space-bottom'></div>
          <fieldset>
            <legend>결제정보</legend>
            <form role='form' className='form-horizontal' id='payment-information'>
              <div className='row'>
                <div className='col-md-3'>
                  <h3 className='title'>결제수단 선택</h3>
                </div>
                <div className='col-md-2 col-md-offset-1'>
                  <label>
                    <input type='radio'
                      id='paymentMethod' value='card' onChange={this._handleOnChangeInput}
                      checked={this.state.paymentMethod === 'card'} /> 체크/신용카드
                  </label>
                </div>
                <div className='col-md-2'>
                  <label>
                    <input type='radio'
                      id='paymentMethod' value='trans' onChange={this._handleOnChangeInput}
                      checked={this.state.paymentMethod === 'trans'} /> 실시간계좌이체
                  </label>
                </div>
                <div className='col-md-2'>
                  <label>
                    <input type='radio'
                      id='paymentMethod' value='vbank' onChange={this._handleOnChangeInput}
                      checked={this.state.paymentMethod === 'vbank'} /> 가상계좌
                  </label>
                </div>
                <div className='col-md-2'>
                  <label>
                    <input type='radio'
                      id='paymentMethod' value='phone' onChange={this._handleOnChangeInput}
                      checked={this.state.paymentMethod === 'phone'} /> 휴대폰소액결제
                  </label>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      )
    }
    return (
      <section className='main-container'>
        <div className='container'>
          <div className='row'>
            <div className='main col-md-12'>
              <h1 className='page-title'>{this.state.mode}</h1>
              <div className='separator-2'></div>
              <table className='table cart table-hover table-colored'>
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>단가</th>
                    <th>수량</th>
                    <th>{this.state.mode === '장바구니' ? '삭제' : null}</th>
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
              {renderBillingInfo()}
              {renderPaymentInfo()}
              {this.state.validateText.length > 0 &&
                <Alert type='danger' text={this.state.validateText} />
              }
              {renderButtons()}
            </div>
          </div>
        </div>
        <MessageModal
          show={this.state.messageModal.show}
          message={this.state.messageModal.message}
          confirmBtnTxt='확인'
          onConfirmClick={this._hideMessageModal}
          close={this._hideMessageModal}
          id={keygen._()}
        />
      </section>
    )
  }
}

CartView.contextTypes = {
  router: PropTypes.object
}

CartView.propTypes = {
  carts: PropTypes.array,
  user: PropTypes.object,
  fetchCartsByUserId: PropTypes.func.isRequired,
  params: PropTypes.object,
  orderItem: PropTypes.object,
  receiveOrderTransaction: PropTypes.func.isRequired
}

export default CartView
