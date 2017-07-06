import React from 'react'
import { convertDateToString, extractDaysFromLessonDays, extractDetailScheduleFromLessonDays,
  setRecentItemToCookie, getCookie } from 'common/util'
import MapModal from 'components/MapModal'
import numeral from 'numeral'
import LessonRequestActionBlock from 'components/LessonRequestActionBlock'
import LinkButton from 'components/LinkButton'
import Comment from 'components/Comment'
import $ from 'jquery'
import CommentModal from 'components/CommentModal'
import keygen from 'keygenerator'
import Button from 'components/Button'
import RecentItem from 'components/RecentItem'
import Alert from 'components/Alert'
import Loading from 'components/Loading'
import ImageCarousel from 'components/ImageCarousel'
import Parallax from 'components/Parallax'
import DatePicker from 'components/DatePicker'
import { deleteCartByUserIdAndItemTypeAndItemIdAndCartType, postCart, getCartsByUserId } from 'common/CartService'
import { Tooltip } from 'react-bootstrap'
import { getCommentsByUserIdAndType } from 'common/CommentService'
import { groupFlower } from 'common/constants'

class ItemView extends React.Component {
  constructor (props) {
    super(props)
    let date = new Date()
    date = new Date(date.valueOf() + (24 * 60 * 60 * 1000 * 2))
    this.state = {
      showMap: false,
      quantity: 1,
      option1: { name: '선택안함', price: 0 },
      option2: { name: '선택안함', price: 0 },
      option3: { name: '선택안함', price: 0 },
      tabActivated: 'review',
      commentModal: { show: false, type: 'review' },
      reviews: { curPage: 0, perPage: 5, isLoading: false },
      inquiries: { curPage: 0, perPage: 5, isLoading: false },
      loading: { isLoading: true, text: '상품 정보를 불러오는 중..' },
      receiveDateISO: date.toISOString(),
      receiveDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      receiveTime: '오전 10시 ~ 오전 12시',
      receiveArea: { name: '서울', price: 0 },
      carouselFlag: true,
      isReviewWriteable: false,
      pointInfoFlag: false, // 포인트 적립정보 툴팁을 다시 렌더링 하기위한 플래그
      itemOptions: []
    }
    this._handleOnClickShowMap = this._handleOnClickShowMap.bind(this)
    this._handleOnClickHideMap = this._handleOnClickHideMap.bind(this)
    this._handleOnChangeQuantity = this._handleOnChangeQuantity.bind(this)
    this._handleOnClickTab = this._handleOnClickTab.bind(this)
    this._handleOnClickAddToWishList = this._handleOnClickAddToWishList.bind(this)
    this._handleOnClickWriteComment = this._handleOnClickWriteComment.bind(this)
    this._handleOnClickCloseCommentModal = this._handleOnClickCloseCommentModal.bind(this)
    this._handleOnSubmitComplete = this._handleOnSubmitComplete.bind(this)
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
    this._loadItemInfo = this._loadItemInfo.bind(this)
    this._unselectItem = this._unselectItem.bind(this)
    this._isValidPage = this._isValidPage.bind(this)
    this._handleOnChangeDate = this._handleOnChangeDate.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._initializeState = this._initializeState.bind(this)
    this._handleOnClickRemoveFromWishList = this._handleOnClickRemoveFromWishList.bind(this)
    this._getItemPrice = this._getItemPrice.bind(this)
    this._getTotalPrice = this._getTotalPrice.bind(this)
    this._handleOnClickAddToCart = this._handleOnClickAddToCart.bind(this)
    this._renderPointInfo = this._renderPointInfo.bind(this)
    this._handleOnClickBuy = this._handleOnClickBuy.bind(this)
    this._renderWriteReviewButton = this._renderWriteReviewButton.bind(this)
    this._handleOnClickReOpen = this._handleOnClickReOpen.bind(this)
    this._reviewSubmitAuthorityValidator = this._reviewSubmitAuthorityValidator.bind(this)
    this._changeFlagRecursively = this._changeFlagRecursively.bind(this)
    this._handleOnBlurQuantity = this._handleOnBlurQuantity.bind(this)
    this._handleOnClickInquiry = this._handleOnClickInquiry.bind(this)
    this._handleOnChangeItemOptionInput = this._handleOnChangeItemOptionInput.bind(this)
  }
  componentDidMount () {
    window.scrollTo(0, 0)
    if (this._isValidPage()) {
      this._loadItemInfo()
      .then(() => {
        $('img').css('margin', '0 auto')
      })
    } else {
      this.context.router.push('/not-found')
    }
    $(window).resize(() => {
      this._renderPointInfo()
    })
    this._changeFlagRecursively()
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.pointInfoFlag !== nextState.pointInfoFlag) return true
    if (nextState.carouselFlag !== this.state.carouselFlag) return false
    return true
  }
  componentWillUpdate (nextProps, nextState) {
    if (!this.state.carouselFlag) this.setState({ carouselFlag: !this.state.carouselFlag })
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.params !== prevProps.params) {
      this._unselectItem()
      this._initializeState()
      this._loadItemInfo()
      window.scrollTo(0, 0)
      this._changeFlagRecursively()
    }
  }
  componentWillUnmount () {
    this._unselectItem(this.props.params.type)
    this.props.clearItemInquiries()
    this.props.clearReviews()
  }
  _changeFlagRecursively () {
    this.setState({ pointInfoFlag: !this.state.pointInfoFlag })
    if ($('#point-info').length < 1) {
      setTimeout(() => this._changeFlagRecursively(), 100)
    }
  }
  _initializeState () {
    let date = new Date()
    date = new Date(date.valueOf() + (24 * 60 * 60 * 1000 * 2))
    this.setState({
      showMap: false,
      quantity: 1,
      option1: { name: '선택안함', price: 0 },
      option2: { name: '선택안함', price: 0 },
      option3: { name: '선택안함', price: 0 },
      tabActivated: 'review',
      commentModal: { show: false, type: 'review' },
      reviews: { curPage: 0, perPage: 5, isLoading: false },
      inquiries: { curPage: 0, perPage: 5, isLoading: false },
      loading: { isLoading: true, text: '상품 정보를 불러오는 중..' },
      receiveDateISO: date.toISOString(),
      receiveDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      receiveTime: '오전 10시 ~ 오전 12시',
      receiveArea: { name: '서울', price: 0 },
      carouselFlag: true,
      isReviewWriteable: false
    })
  }
  _isValidPage () {
    const { type } = this.props.params
    if (type !== 'product' && type !== 'lesson') {
      return false
    }
    return true
  }
  _unselectItem () {
    this.props.unselectLesson()
    this.props.unselectProduct()
  }
  _loadItemInfo () {
    const type = this.props.params.type
    let fetchItem = this.props.fetchProduct
    if (type === 'lesson') fetchItem = this.props.fetchLesson
    this.setState({ loading: { isLoading: true, text: `${type === 'lesson' ? '레슨' : '상품'} 정보를 불러오는 중..` } })
    return fetchItem(this.props.params.id)
    .then(() => {
      // console.log('아이템 로드 완료')
      if (!this.props.item || !this.props.item.activated) {
        this.context.router.push('/not-found')
        return
      }
      this.setState({ itemPrice: this.props.item.price,
        quantity: this.props.item.subCategory === '단체꽃다발' ? groupFlower.MIN_QTY : 1 })
      const itemOptions = []
      if (this.props.item.options.length > 0) {
        const categorySet = new Set()
        this.props.item.options.forEach(option => categorySet.add(option.category))
        categorySet.forEach(category => {
          itemOptions.push(this.props.item.options.filter(option => option.category === category)[0])
        })
        this.setState({ itemOptions })
      }
      return this.props.fetchReviewsByGroupName(this.props.item.groupName,
        this.state.reviews.curPage, this.state.reviews.perPage)
    })
    .then(() => {
      // console.log('리뷰 로드 완료')
      return this.props.fetchItemInquiriesByGroupName(this.props.item.groupName,
        this.state.reviews.curPage, this.state.reviews.perPage)
    })
    .then(() => {
      // console.log('문의 로드 완료')
      return this.props.fetchRelatedItems(this.props.item, type)
    })
    .then(() => {
      // console.log('관련상품 로드 완료')
      const recentItem = {
        id: this.props.item.id,
        type: type,
        mainCategory: this.props.item.mainCategory,
        subCategory: this.props.item.subCategory,
        title: this.props.item.title,
        titleImg: this.props.item.titleImg,
        price: this.props.item.price,
        discountedPrice: this.props.item.discountedPrice
      }
      setRecentItemToCookie(recentItem)
      // console.log('최근본 상품 로컬스토리지에 저장 완료')
      return this._renderWriteReviewButton()
      .then(() => {
        // console.log('리뷰작성 버튼 렌더링 완료')
        this.setState({ loading: { isLoading: false } })
        return Promise.resolve()
      })
    })
  }
  _handleOnClickShowMap () {
    this.setState({ showMap: true })
  }
  _handleOnClickHideMap () {
    this.setState({ showMap: false })
  }
  _handleOnChangeQuantity (e) {
    let quantity = e.target.value
    if (quantity !== '' && quantity < 1) quantity = 1
    // if (this.props.item.subCategory === '단체꽃다발') {
    //   if (quantity < groupFlower.MIN_QTY) quantity = groupFlower.MIN_QTY
    // } else if (quantity < 1) quantity = 1
    this.setState({ quantity })
  }
  _handleOnClickTab (e) {
    const type = e.target.dataset.type
    this.setState({ tabActivated: type })
    const paneToShow = type === 'review' ? $('#reviewPane') : $('#inquiryPane')
    const paneToHide = type === 'review' ? $('#inquiryPane') : $('#reviewPane')
    paneToShow.addClass('in')
    paneToShow.addClass('active')
    paneToHide.removeClass('in')
    paneToHide.removeClass('active')
  }
  _handleOnClickAddToWishList () {
    const { user, item, params, fetchCartsByUserId } = this.props
    if (!user) {
      this.context.router.push('/login')
      return
    }
    const wishList = { userId: user.id, type: '위시리스트' }
    if (params.type === 'lesson') {
      wishList.lessonId = item.id
    } else {
      wishList.productId = item.id
    }
    postCart(wishList)
    .then(() => {
      return fetchCartsByUserId(user.id)
    })
  }
  _handleOnClickRemoveFromWishList () {
    const { item, user, params } = this.props
    deleteCartByUserIdAndItemTypeAndItemIdAndCartType(user.id, params.type, item.id, '위시리스트')
    .then(() => {
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  _handleOnClickWriteComment () {
    this.setState({ commentModal: { show: true, type: this.state.tabActivated } })
  }
  _handleOnClickCloseCommentModal () {
    this.setState({ commentModal: Object.assign({}, this.state.commentModal, { show: false }) })
  }
  _handleOnSubmitComplete () {
    this.setState({ [this.state.tabActivated]: { curPage: 0, perPage: 5 } })
    const action = this.state.tabActivated === 'review'
      ? this.props.fetchReviewsByGroupName : this.props.fetchItemInquiriesByGroupName
    action(this.props.item.groupName, 0, this.state.reviews.perPage)
    .then(() => {
      this.props.fetchUserByUserId(this.props.user.id)
    })
    .then(() => {
      this._renderWriteReviewButton()
    })
  }
  _handleOnClickMoreList () {
    const commentType = this.state.tabActivated === 'review' ? 'reviews' : 'inquiries'
    const appendList = this.state.tabActivated === 'review'
      ? this.props.appendReviewsByGroupName : this.props.appendItemInquiriesByGroupName
    this.setState({ [commentType]:
      { curPage: this.state[commentType].curPage + 1, perPage: 5, isLoading: true } })
    appendList(this.props.item.groupName,
      this.state[commentType].curPage + 1, this.state.reviews.perPage)
    .then(() => {
      this.setState({ [commentType]:
        Object.assign({}, this.state[commentType], { isLoading: false }) })
    })
  }
  _handleOnChangeDate (value, formattedValue) {
    let receiveDate = new Date(value)
    const today = new Date()
    const theDayAfterTomorrow = new Date(today.valueOf() + (24 * 60 * 60 * 1000 * 2))
    const theDayAfterTomorrowISO = theDayAfterTomorrow.toISOString()
    if (value < theDayAfterTomorrowISO) receiveDate = theDayAfterTomorrow
    this.setState({
      receiveDateISO: receiveDate.toISOString(),
      receiveDate: `${receiveDate.getFullYear()}-${receiveDate.getMonth() + 1}-${receiveDate.getDate()}` })
  }
  _handleOnChangeInput (e) {
    const id = e.target.id
    const value = e.target.value
    if (value.indexOf(':') > 0) {
      const name = value.split(':')[0]
      const price = Number(value.split(':')[1])
      this.setState({ [id]: { name, price } })
    } else {
      this.setState({ [id]: value })
    }
  }
  _getItemPrice = () => {
    let itemPrice = this.props.item.discountedPrice === 0 ? this.props.item.price : this.props.item.discountedPrice
    if (this.props.item.subCategory === '단체꽃다발') {
      if (this.state.quantity >= groupFlower.QTYS[0] && this.state.quantity < groupFlower.QTYS[1]) {
        itemPrice = itemPrice - (itemPrice * groupFlower.DISCOUNT_RATE[0])
      } else if (this.state.quantity >= groupFlower.QTYS[1] && this.state.quantity < groupFlower.QTYS[2]) {
        itemPrice = itemPrice - (itemPrice * groupFlower.DISCOUNT_RATE[1])
      } else if (this.state.quantity >= groupFlower.QTYS[2] && this.state.quantity < groupFlower.QTYS[3]) {
        itemPrice = itemPrice - (itemPrice * groupFlower.DISCOUNT_RATE[2])
      } else if (this.state.quantity >= groupFlower.QTYS[3]) {
        itemPrice = itemPrice - (itemPrice * groupFlower.DISCOUNT_RATE[3])
      }
    }
    const itemOptionPrice = this.state.itemOptions.reduce((prev, curr) => prev.addPrice + curr.addPrice)
    return itemPrice +
      this.state.option1.price + this.state.option2.price + this.state.option3.price + this.state.receiveArea.price + parseInt(itemOptionPrice)
  }
  _getTotalPrice = () => {
    return this._getItemPrice() * this.state.quantity
  }
  _handleOnClickAddToCart () {
    const { user, params, item, fetchCartsByUserId } = this.props
    if (!user) {
      this.context.router.push('/login')
      return
    }
    const options = []
    options.push(this.state.option1)
    options.push(this.state.option2)
    options.push(this.state.option3)
    this.state.itemOptions.forEach(option => {
      option.price = option.addPrice
      options.push(option)
    })
    const cart = {
      userId: user.id,
      quantity: this.state.quantity,
      type: '장바구니',
      options: JSON.stringify(options),
      totalAmount: this._getTotalPrice(),
      itemPrice: this._getItemPrice(),
      receiveDate: this.state.receiveDate,
      receiveTime: this.state.receiveTime,
      receiveArea: JSON.stringify(this.state.receiveArea)
    }
    if (params.type === 'lesson') {
      cart.lessonId = item.id
    } else {
      cart.productId = item.id
    }
    postCart(cart)
    .then(() => {
      return fetchCartsByUserId(user.id)
    })
    .then(() => {
      window.scrollTo(0, 0)
      $('.cart-btn').click()
    })
  }
  _renderPointInfo () {
    const priceArea = $('#priceArea').position()
    if (priceArea) {
      const positionLeft = priceArea.left + 65
      const positionTop = priceArea.top - 32
      return (
        <Tooltip positionLeft={positionLeft} positionTop={positionTop} placement='top' id='point-info' className='in'
          style={{ zIndex: '99' }}>
          <span className='text-default'>+{numeral(this._getTotalPrice() * 0.01).format('0,0')}P</span> 적립
        </Tooltip>
      )
    }
  }
  _handleOnClickBuy () {
    const { item, receiveOrderItem, user, params } = this.props
    const { router } = this.context
    if (!user) {
      router.push('/login')
      return
    }
    const options = []
    options.push(this.state.option1)
    options.push(this.state.option2)
    options.push(this.state.option3)
    this.state.itemOptions.forEach(option => {
      option.price = option.addPrice
      options.push(option)
    })
    const orderItem = {
      userId: user.id,
      lessonId: params.type === 'lesson' ? item.id : null,
      productId: params.type === 'lesson' ? null : item.id,
      quantity: this.state.quantity,
      type: '장바구니',
      options: JSON.stringify(options),
      totalAmount: this._getTotalPrice(),
      itemPrice: this._getItemPrice(),
      receiveDate: this.state.receiveDate,
      receiveTime: this.state.receiveTime,
      receiveArea: JSON.stringify(this.state.receiveArea),
      lesson: params.type === 'lesson' ? item : null,
      product: params.type === 'lesson' ? null : item
    }
    receiveOrderItem(orderItem)
    router.push('/cart/direct')
  }
  _renderWriteReviewButton () {
    // console.log('리뷰 버튼 렌더링 중')
    const { carts, params, item, user } = this.props
    if (!carts) return Promise.resolve()
    const filteredCarts = carts.filter(cart => {
      if (params.type === 'lesson') {
        return cart.lessonId === item.id && cart.status === '수강완료'
      } else {
        return cart.productId === item.id && cart.status === '배송완료'
      }
    })
    return getCommentsByUserIdAndType(user.id, 'review')
    .then(res => {
      const userReviews = res.data
      const filteredUserReviews = userReviews.filter(review => review.groupName === item.groupName)
      if (filteredCarts.length > filteredUserReviews.length) {
        this.setState({ isReviewWriteable: true })
      } else {
        this.setState({ isReviewWriteable: false })
      }
      return Promise.resolve()
    })
  }
  _reviewSubmitAuthorityValidator () {
    if (this.props.isAdmin) return Promise.resolve()
    const { user, params, item } = this.props
    return getCartsByUserId(user.id)
    .then(res => {
      const carts = res.data
      if (!carts) return Promise.reject()
      const filteredCarts = carts.filter(cart => {
        if (params.type === 'lesson') {
          return cart.lessonId === item.id && cart.status === '수강완료'
        } else {
          return cart.productId === item.id && cart.status === '배송완료'
        }
      })
      return getCommentsByUserIdAndType(user.id, 'review')
      .then(res => {
        const userReviews = res.data
        const filteredUserReviews = userReviews.filter(review => review.groupName === item.groupName)
        if (filteredCarts.length > filteredUserReviews.length) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      })
    })
  }
  _handleOnClickReOpen () {
    const inquiryModal = {
      mode: 'post',
      defaultCategory: '레슨재개설신청',
      inquiry: {
        title: '레슨을 다시 개설해주세요.',
        content:
`희망 레슨 : ${this.props.item.title}
희망 지역 :
희망일 :
희망 인원 :
신청자이름 : ${this.props.user ? this.props.user.name : ''}
연락처 : ${this.props.user ? this.props.user.phone : ''}`
      },
      afterSubmit: () => {
        const messageModal = {
          show: true,
          message: '문의가 완료되었습니다. 빠른 시일내에 답변드리겠습니다.',
          cancelBtnTxt: null,
          confirmBtnTxt: '확인',
          onConfirmClick: () => this.props.setMessageModalShow(false),
          process: false
        }
        this.props.setMessageModal(messageModal)
      },
      show: true,
      process: false
    }
    this.props.setInquiryModal(inquiryModal)
  }
  _handleOnBlurQuantity (e) {
    let quantity = e.target.value
    if (this.props.item.subCategory === '단체꽃다발') {
      if (quantity < groupFlower.MIN_QTY) quantity = groupFlower.MIN_QTY
    } else if (quantity < 1) quantity = 1
    this.setState({ quantity })
  }
  _handleOnClickInquiry () {
    const inquiryModal = {
      mode: 'post',
      defaultCategory: '기타',
      inquiry: {
        title: `${this.props.item.title} 관련 문의`,
        content:
`상품명 : ${this.props.item.title}
신청자이름 : ${this.props.user ? this.props.user.name : ''}
연락처 : ${this.props.user ? this.props.user.phone : ''}
문의내용: `
      },
      afterSubmit: () => {
        const messageModal = {
          show: true,
          message: '문의가 완료되었습니다. 빠른 시일내에 답변드리겠습니다.',
          cancelBtnTxt: null,
          confirmBtnTxt: '확인',
          onConfirmClick: () => this.props.setMessageModalShow(false),
          process: false
        }
        this.props.setMessageModal(messageModal)
      },
      show: true,
      process: false
    }
    this.props.setInquiryModal(inquiryModal)
  }
  _handleOnChangeItemOptionInput (e) {
    const { category } = e.target.dataset
    const { value } = e.target
    const name = value.split(':')[0]
    const addPrice = value.split(':')[1]
    const itemOptions = this.state.itemOptions.map(option => {
      if (option.category === category) {
        const newOption = {}
        newOption.name = name
        newOption.addPrice = addPrice
        return Object.assign({}, option, newOption)
      }
      return option
    })
    this.setState({ itemOptions })
  }
  render () {
    const { type } = this.props.params
    const { item } = this.props
    const renderShowMoreReviewsButton = () => {
      if (this.props.reviews && !this.props.reviews.last) {
        return (
          <Button
            className='btn-block'
            onClick={this._handleOnClickMoreList}
            style={{ marginTop: '-30px' }}
            process={this.state.reviews.isLoading}
            square
            color='gray'
            textComponent={
              <span>
                <i className='fa fa-angle-down' /> <strong>
                  {this.props.reviews.totalPages - 1 -
                  this.props.reviews.number === 1 ? this.props.reviews.totalElements -
                  (this.props.reviews.number + 1) * this.props.reviews.numberOfElements
                  : this.props.reviews.numberOfElements}</strong>건 더 보기
              </span>
            }
          />
        )
      }
    }
    const renderShowMoreItemInquiriesButton = () => {
      if (this.props.inquiries && !this.props.inquiries.last) {
        return (
          <Button
            className='btn-block'
            onClick={this._handleOnClickMoreList}
            style={{ marginTop: '-30px' }}
            process={this.state.inquiries.isLoading}
            square
            color='gray'
            textComponent={
              <span>
                <i className='fa fa-angle-down' /> <span className='text-default'>
                  {this.props.inquiries.totalPages - 1 -
                  this.props.inquiries.number === 1 ? this.props.inquiries.totalElements -
                  (this.props.inquiries.number + 1) * this.props.inquiries.numberOfElements
                  : this.props.inquiries.numberOfElements}</span>건 더 보기
              </span>
            }
          />
        )
      }
    }
    const renderTimeOptions = () => {
      // TODO 추후 당일 배송 혹은 익일 배송을 위한 로직 필요
      const returnComponent = []
      returnComponent.push(
        <option key={keygen._()} value='오전 10시 ~ 오전 12시'>오전 10시 ~ 오전 12시</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='오후 2시 ~ 오후 4시'>오후 2시 ~ 오후 4시</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='저녁 6시 ~ 저녁 8시'>저녁 6시 ~ 저녁 8시</option>
      )
      return returnComponent
    }
    const renderAreaOptions = () => {
      const returnComponent = []
      returnComponent.push(
        <option key={keygen._()} value='서울:0'>서울 (무료)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='성남|과천|하남|의왕:10000'>성남|과천|하남|의왕 (+10,000)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='용인(처인구 제외)|부천|안양|구리|광명|군포:20000'>용인(처인구 제외)|부천|안양|구리|광명|군포 (+20,000)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='고양|수원|안산|인천(중구,강화군 제외)|광주|의정부:25000'>고양|수원|안산|인천(중구,강화군 제외)|광주|의정부 (+25,000)</option>
      )
      return returnComponent
    }
    const renderLevel = () => {
      return (
        <div>
          <div className={`text-center`}
            style={{ width: '80px', borderRadius: '2px', display: 'inline-block', backgroundColor: item.level === 1 || item.level === 4 || item.level === 6 ? '#21bb9d' : 'rgb(212, 212, 212)', color: 'white', marginRight: '2px' }}
            >초급</div>
          <div className='text-center' style={{ width: '80px', borderRadius: '2px', display: 'inline-block', backgroundColor: item.level === 2 || item.level >= 4 ? '#21bb9d' : 'rgb(212, 212, 212)', color: 'white', marginRight: '2px' }}>중급</div>
          <div className='text-center' style={{ width: '80px', borderRadius: '2px', display: 'inline-block', backgroundColor: item.level === 3 || item.level >= 5 ? '#21bb9d' : 'rgb(212, 212, 212)', color: 'white', marginRight: '2px' }}>고급</div>
        </div>
      )
    }
    const renderItemOptions = () => {
      if (item.options.length > 0) {
        const categorySet = new Set()
        item.options.forEach(option => {
          categorySet.add(option.category)
        })
        const returnComponent = []
        categorySet.forEach(category => {
          const categoryOptions = item.options.filter(option => option.category === category)
          returnComponent.push(
            <tr>
              <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>{category}</strong></td>
              <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>{category}</strong></div>
              <td>
                <select className='form-control' id='itemOption' data-category={category} style={{ width: '200px' }}
                  value={this.state.itemOptions.filter(option => option.category === category)[0].name + ':' + this.state.itemOptions.filter(option => option.category === category)[0].addPrice}
                  onChange={this._handleOnChangeItemOptionInput}>
                  {categoryOptions.map(option => <option value={`${option.name}:${option.addPrice}`}>{option.name} ({`+${numeral(option.addPrice).format('0,0')}원`})</option>)}
                </select>
              </td>
            </tr>
          )
        })
        return returnComponent
      }
    }
    const renderSpecs = () => {
      if (item.lessonDate || item.lessonDays && type === 'lesson') {
        /* eslint-disable */
        return (
          <table className='table' style={{ marginBottom: '0px' }}>
            <tbody>
              <tr>
                <td className='text-right' style={{ width: '90px' }}><strong>난이도</strong></td>
                <td>{renderLevel()}</td>
              </tr>
              {
                !item.expired &&
                <tr>
                  <td className='text-right'><strong>모집인원</strong></td>
                  <td>최대 <strong>{item.maxParty}</strong>명, 현재 <strong>{item.currParty}</strong>명 등록 중</td>
                </tr>
              }
              {
                !item.oneday && !item.expired &&
                <tr>
                  <td className='text-right'><strong>레슨일정</strong></td>
                  <td>오는 <strong>{convertDateToString(item.lessonDate)}</strong>부터 <strong>{`${item.weekType} ${extractDaysFromLessonDays(item.lessonDays)}요일`}</strong>에 <strong>{item.weekLong}주간</strong> 진행</td>
                </tr>
              }
              {
                !item.oneday && !item.expired &&
                <tr>
                  <td className='text-right'><strong>레슨시간</strong></td>
                  <td>{extractDetailScheduleFromLessonDays(item.lessonDays).map(elem => <div key={keygen._()}>{elem}<br /></div>)}</td>
                </tr>
              }
              {
                item.oneday && !item.expired &&
                <tr>
                  <td className='text-right'><strong>레슨일정</strong></td>
                  <td>오는 <strong>{convertDateToString(item.lessonDate)}</strong>에 진행되는 <strong>원데이레슨</strong></td>
                </tr>
              }
              { !item.expired &&
                <tr>
                  <td className='text-right'><strong>장소</strong></td>
                  <td>{`${item.address} ${item.restAddress} `}<LinkButton onClick={this._handleOnClickShowMap} textComponent={<span>지도보기 <i className='fa fa-map-marker' /></span>} /></td>
                </tr>
            }
            </tbody>
          </table>
        )
        /* eslint-enable */
      } else if (item.mainCategory === '꽃다발') {
        return (
          <table className='table' style={{ marginBottom: '0px' }}>
            <tbody>
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령일</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령일</strong></div>
                    <DatePicker
                      id='receiveDate'
                      onChange={this._handleOnChangeDate}
                      value={this.state.receiveDateISO}
                    />
                    <small><i className='fa fa-exclamation-circle' /> 주문과 함께 만들어지기 때문에 최소 이틀이 소요됩니다.</small>
                  </td>
                </tr>
              }
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령시간</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령시간</strong></div>
                    <select className='form-control' id='receiveTime' style={{ width: '200px' }}
                      value={this.state.receiveTime} onChange={this._handleOnChangeInput}>
                      {renderTimeOptions()}
                    </select>
                  </td>
                </tr>
              }
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령지역</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령지역</strong></div>
                    <select className='form-control' id='receiveArea' style={{ width: '300px' }}
                      value={`${this.state.receiveArea.name}:${this.state.receiveArea.price}`}
                      onChange={this._handleOnChangeInput}>
                      {renderAreaOptions()}
                    </select>
                    <small><i className='fa fa-exclamation-circle' /> 현재 배송은 서울 및 수도권(일부지역 제외)만 가능합니다.</small>
                  </td>
                </tr>
              }
              {renderItemOptions()}
              <tr>
                <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>옵션</strong></td>
                <td>
                  <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>옵션</strong></div>
                  <select className='form-control' id='option1' style={{ width: '200px' }}
                    value={this.state.option1.name + ':' + this.state.option1.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='편지추가:0'>편지추가 (무료)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        )
        /* eslint-enable */
      } else if (item.subCategory === '부케') {
        return (
          <table className='table' style={{ marginBottom: '0px' }}>
            <tbody>
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령일</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령일</strong></div>
                    <DatePicker
                      id='receiveDate'
                      onChange={this._handleOnChangeDate}
                      value={this.state.receiveDateISO}
                    />
                    <small><i className='fa fa-exclamation-circle' /> 주문과 함께 만들어지기 때문에 최소 이틀이 소요됩니다.</small>
                  </td>
                </tr>
              }
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령시간</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령시간</strong></div>
                    <select className='form-control' id='receiveTime' style={{ width: '200px' }}
                      value={this.state.receiveTime} onChange={this._handleOnChangeInput}>
                      {renderTimeOptions()}
                    </select>
                  </td>
                </tr>
              }
              {
                item.deliveryType === '퀵' &&
                <tr>
                  <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령지역</strong></td>
                  <td>
                    <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희방 수령지역</strong></div>
                    <select className='form-control' id='receiveArea' style={{ width: '300px' }}
                      value={`${this.state.receiveArea.name}:${this.state.receiveArea.price}`}
                      onChange={this._handleOnChangeInput}>
                      {renderAreaOptions()}
                    </select>
                    <small><i className='fa fa-exclamation-circle' /> 현재 배송은 서울 및 수도권(일부지역 제외)만 가능합니다.</small>
                  </td>
                </tr>
              }
              <tr>
                <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>코사지세트</strong></td>
                <td>
                  <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>코사지세트</strong></div>
                  <select className='form-control' id='option1' style={{ width: '200px' }}
                    value={this.state.option1.name + ':' + this.state.option1.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='코사지세트:30000'>코사지세트 (+30,000)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>부토니에</strong></td>
                <td>
                  <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>부토니에</strong></div>
                  <select className='form-control' id='option2' style={{ width: '200px' }}
                    value={this.state.option2.name + ':' + this.state.option2.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='부토니에:5000' data-price={5000}>부토니에 (+5,000)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>플라워샤워</strong></td>
                <td>
                  <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>플라워샤워</strong></div>
                  <select className='form-control option' id='option3' style={{ width: '200px' }}
                    value={this.state.option3.name + ':' + this.state.option3.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='플라워샤워:20000' data-price={20000}>플라워샤워 (+20,000)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        )
      } else {
        if (item.options.length > 0) {
          return (
            <table className='table' style={{ marginBottom: '0px' }}>
              <tbody>
                {renderItemOptions()}
              </tbody>
            </table>
          )
        }
      }
    }
    const renderLessonQuantity = () => {
      const returnComponent = []
      const availableQty = item.maxParty - item.currParty
      for (let i = 1; i <= availableQty; i++) {
        returnComponent.push(
          <option key={keygen._()} value={i}>{`${i}명`}</option>
        )
      }
      return returnComponent
    }
    const renderOptions = () => {
      if (type === 'lesson') {
        /* eslint-disable */
        return (
          <div>
            <div className='form-group'>
              {`￦${numeral(this._getItemPrice()).format('0,0')} `}<i className='fa fa-times-circle' />{' '}
              <select className='form-control' id='quantity' value={this.state.quantity} onChange={this._handleOnChangeQuantity}>
                {renderLessonQuantity()}
              </select>
            </div>
          </div>
        )
      } else if (type === 'product') {
        return (
          <div>
            <div className='form-group'>
              {this.props.item.subCategory === '단체꽃다발' && this.state.quantity >= 5 ? <del className='text-muted' style={{ paddingRight: '5px', fontSize: '13px' }}>{`￦${numeral(this.props.item.discountedPrice === 0 ? this.props.item.price : this.props.item.discountedPrice).format('0,0')}`}</del> : ''}{`￦${numeral(this._getItemPrice()).format('0,0')} `}<i className='fa fa-times-circle' />{' '}
              <input className='' type='number' style={{ width: '50px', paddingRight: '5px', paddingLeft: '5px' }} id='quantity' value={this.state.quantity} onFocus={e => e.target.value = ''} onBlur={this._handleOnBlurQuantity} onChange={this._handleOnChangeQuantity} /> 개
            </div>
            {this.props.item.subCategory === '단체꽃다발' && <div><small><i className='fa fa-exclamation-circle' /> 단체꽃다발은 5개 이상만 주문 가능합니다.<br /><i className='fa fa-exclamation-circle' /> 5/10/15/20개 이상 구간으로 할인이 적용됩니다.</small></div>}
          </div>
        )
        /* eslint-enable */
      }
    }
    const renderPrice = () => {
      if (item.expired) {
        return <Alert type='warning' text='신청 기간이 지난 레슨입니다. 다음 번엔 좀 더 서두르세요!' button={
          <Button
            textComponent={<span>재개설 신청하기</span>}
            size='sm'
            color='dark'
            onClick={this._handleOnClickReOpen}
          />
        } />
      } else if (item.soldOut) {
        return <Alert type='warning' text='일시적으로 품절된 상품입니다. 다음 번엔 좀 더 서두르세요!' />
      } else if (type === 'lesson' && item.maxParty <= item.currParty) {
        return <Alert type='warning' text='인원이 모두 차버렸네요. 다른 레슨을 찾아보세요.' />
      } else if (!item.price || item.price === 0) {
        return <Alert type='info' text='개별적으로 문의가 필요한 상품입니다.' button={
          <Button
            textComponent={<span>1:1 문의하기</span>}
            size='sm'
            color='dark'
            onClick={this._handleOnClickInquiry}
          />
        } />
      } else {
        /* eslint-disable */
        return (
          <div>
            <div className='row grid-space-10'>
              <div className='col-md-12'>
                <form role='form' className='form-inline text-right'>
                  {renderOptions()}
                </form>
              </div>
            </div>
            <div className='light-gray-bg p-20 bordered clearfix'>
              <span className='product price' id='priceArea'>
                {this._renderPointInfo()}
                <i className='icon-tag pr-10' />￦{numeral(this._getTotalPrice()).format('0,0')}
              </span>
              <div className='product elements-list pull-right clearfix'>
                {type !== 'lesson' &&
                  <Button className='margin-clear' animated onClick={this._handleOnClickAddToCart}
                    textComponent={<span>장바구니에 담기 <i className='fa fa-shopping-cart' /></span>}
                    style={{ marginRight: '3px' }}
                  />
                }
                <Button className='margin-clear' animated color='dark' onClick={this._handleOnClickBuy}
                  textComponent={<span>{type !== 'lesson' ? '바로구매' : '바로 신청하기'} <i className='fa fa-credit-card-alt' /></span>}
                />
              </div>
            </div>
          </div>
        )
        /* eslint-enable */
      }
    }
    const renderImages = () => {
      let returnComponent = null
      if (type === 'lesson') {
        returnComponent = (
          <div className='tab-content clear-style'>
            <img src={item.titleImg} />
          </div>
        )
      } else if (type === 'product' && item.images) {
        returnComponent = <ImageCarousel key={this.state.carouselFlag} images={JSON.parse(item.images)} />
      }
      return returnComponent
    }
    const renderWishListButton = () => {
      const { carts } = this.props
      if (carts && carts.filter(cart => {
        if (type === 'lesson') return cart.lessonId === item.id && cart.type === '위시리스트'
        else return cart.productId === item.id && cart.type === '위시리스트'
      }).length > 0) {
        return <Button link size='sm' onClick={this._handleOnClickRemoveFromWishList} color='danger' textComponent={<span>위시리스트에서 제거 <i className='fa fa-times' /></span>} /> // eslint-disable-line
      } else {
        return <Button link size='sm' onClick={this._handleOnClickAddToWishList} color='default' textComponent={<span>위시리스트 담기 <i className='fa fa-heart' /></span>} /> // eslint-disable-line
      }
    }
    const renderProductSection = () => {
      /* eslint-disable */
      return (
        <div>
          <Parallax title={<span>{item.title}</span>} description={<span>{item.detail}</span>} backgroundImage={item.titleImg} />
          <section className='main-container'>
            <div className='container'>
              <div className='row'>
                <div className='main col-md-12'>
                  <h2 className='page-title'>{type === 'lesson' ? '레슨정보' : '상품정보'}</h2>
                  <div className='separator-2' />
                  <div className='row'>
                    <div className='col-md-6' style={{ marginBottom: '40px' }}>
                      {renderImages()}
                    </div>
                    <div className='col-md-6'>
                      <h3>{item.title}</h3>
                      <p>{item.detail}{renderWishListButton()}</p>
                      {renderSpecs()}
                      {renderPrice()}
                    </div>
                    {
                      type === 'lesson' &&
                      <MapModal
                        show={this.state.showMap}
                        latitude={Number(item.latitude)}
                        longitude={Number(item.longitude)}
                        close={this._handleOnClickHideMap}
                        label={`${item.address} ${item.restAddress}`}
                      />
                    }
                  </div>
                </div>
              </div>
              <div className='row' style={{ marginTop: '50px' }}>
                <div className='col-md-12'>
                  <h2 className='page-title'>세부정보</h2>
                  <div className='separator-2' />
                  <div className='row'>
                    <div className='col-md-12'>
                      <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )
      /* eslint-enable */
    }
    const renderReviews = () => {
      let returnComponent = null
      if (this.props.reviews && this.props.reviews.content && this.props.reviews.content.length > 0) {
        returnComponent = this.props.reviews.content.map(comment =>
          <Comment item={comment} key={keygen._()} userId={this.props.user ? this.props.user.id : null}
            afterSubmit={this._handleOnSubmitComplete} afterDelete={this._handleOnSubmitComplete}
            point={this._getItemPrice() * 0.01} imagePoint={this._getItemPrice() * 0.01}
            isAdmin={this.props.isAdmin}
          />)
      }
      return returnComponent || <div className='text-center'>등록된 후기가 없습니다.</div>
    }
    const renderItemInquiries = () => {
      let returnComponent = null
      if (this.props.inquiries && this.props.inquiries.content && this.props.inquiries.content.length > 0) {
        returnComponent = this.props.inquiries.content.map(inquiry =>
          <Comment item={inquiry} key={keygen._()} userId={this.props.user ? this.props.user.id : null}
            afterSubmit={this._handleOnSubmitComplete} afterDelete={this._handleOnSubmitComplete}
            isAdmin={this.props.isAdmin}
          />)
      }
      return returnComponent || <div className='text-center'>등록된 문의가 없습니다.</div>
    }
    const renderRecentItems = () => {
      let returnComponent = <div className='text-center'>최근 본 상품이 없습니다.</div>
      const recentItems = JSON.parse(getCookie('recentItems'))
      if (recentItems.length > 1) {
        recentItems.reverse()
        returnComponent = recentItems.map(elem => {
          if (!(elem.id === item.id && elem.type === type)) {
            return (
              <RecentItem key={keygen._()} item={elem} />
            )
          }
        })
      }
      return returnComponent
    }
    const renderRelatedItems = () => {
      let returnComponent = <div className='text-center'>관련된 상품이 없습니다.</div>
      const relatedItems = this.props.relatedItems
      if (relatedItems && relatedItems.length > 0) {
        returnComponent = relatedItems.map(elem => {
          if (!(elem.id === item.id && elem.type === type)) {
            return (
              <RecentItem key={keygen._()} item={elem} />
            )
          }
        })
      }
      return returnComponent
    }
    const renderWriteReviewButtton = () => {
      if (this.state.isReviewWriteable) {
        return (
          <div className='pull-right'>
            <Button
              color='dark'
              onClick={this._handleOnClickWriteComment}
              animated
              textComponent={
                <span>
                  후기작성 <span className='text-default'>+{numeral(item.price * 0.01).format('0,0')}P</span> <i className='fa fa-pencil' />
                </span>
              }
            />
          </div>
        )
      }
    }
    const renderTabSection = () => {
      /* eslint-disable */
      return (
        <section className='pv-30'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8' style={{ marginBottom: '80px' }}>
                <ul className='nav nav-tabs style-4' role='tabList'>
                  <li className={this.state.tabActivated === 'review' ? 'active' : null}>
                    <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickTab} data-type='review'>
                      <i className='fa fa-star pr-5' /> {type === 'lesson' ? '레슨' : '상품'}후기<span className='text-default'>({this.props.reviews ? this.props.reviews.totalElements : 0})</span>
                    </a>
                  </li>
                  <li className={this.state.tabActivated === 'inquiry' ? 'active' : null}>
                    <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickTab} data-type='inquiry'>
                      <i className='fa fa-question-circle pr-5' /> {type === 'lesson' ? '레슨' : '상품'}문의<span className='text-default'>({this.props.inquiries ? this.props.inquiries.totalElements : 0})</span>
                    </a>
                  </li>
                </ul>
                <div className='tab-content padding-top-clear padding-bottom-clear'>
                  <div className='tab-pane fade active in' id='reviewPane'>
                    <div className='comments margin-clear space-top'>
                      {renderReviews()}
                      {renderShowMoreReviewsButton()}
                      {renderWriteReviewButtton()}
                    </div>
                  </div>
                  <div className='tab-pane fade' id='inquiryPane'>
                    <div className='comments margin-clear space-top'>
                      {renderItemInquiries()}
                      {renderShowMoreItemInquiriesButton()}
                      {
                        this.props.user &&
                        <div className='pull-right'>
                          <Button
                            color='dark'
                            onClick={this._handleOnClickWriteComment}
                            animated
                            textComponent={
                              <span>
                                문의하기 <i className='fa fa-pencil' />
                              </span>
                            }
                          />
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
              {
                this.props.user && this.props.item &&
                <CommentModal
                  type={this.state.commentModal.type}
                  show={this.state.commentModal.show}
                  close={this._handleOnClickCloseCommentModal}
                  groupName={this.props.item.groupName}
                  userId={this.props.user.id}
                  afterSubmit={this._handleOnSubmitComplete}
                  imagePoint={this._getItemPrice() * 0.01}
                  point={this._getItemPrice() * 0.01}
                  id='registerComment'
                  validator={this._reviewSubmitAuthorityValidator}
                />
              }
              <div className='col-md-4 col-lg-3 col-lg-offset-1'>
                <div className='sidebar'>
                  <div className='bolck clearfix' style={{ marginBottom: '40px' }}>
                    <h2 className='title'>관련된 상품</h2>
                    <div className='separator-2'></div>
                    {renderRelatedItems()}
                  </div>
                  <div className='bolck clearfix'>
                    <h2 className='title'>최근 본 상품</h2>
                    <div className='separator-2'></div>
                    {renderRecentItems()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
      /* eslint-enable */
    }
    const renderPolicySection = () => {
      return (
        <section className='pv-30 light-gray-bg'>
          <div className='container'>
            { type === 'product' &&
              <div className='row'>
                <div className='col-md-4'>
                  <h4>안내사항</h4>
                  <p>- 선주문 후 제작이 들어가는 100% 주문제작 제품이기 때문에 주문은 넉넉하게 3~4일 전에, 최소 이틀 전에 부탁드려요.</p>
                  <p>- 꽃의 수급에 따라서 디자인은 조금 변경될 수도 있습니다.</p>
                  <p>- 생화상품이므로 퀵배송만 가능합니다. 현재 서울/경기 지역만 배송 가능합니다.</p>
                </div>
                <div className='col-md-4'>
                  <h4>취소 및 환불 관련</h4>
                  <p>- 생화를 취급하기 때문에 배송 전이라도 재료 구매 후에는 환불이 불가한 점 양해 부탁드립니다. 재료구매 문자 바송 후 취소는 불가능합니다.</p>
                  <p>- 재료 구매 전 날 일괄적으로 문자를 발송드립니다. 발송일 당일까지는 취소 가능합니다.</p>
                  <p>- 배송 이후에는 생화라는 특성 상 환불 불가능한 점 양해 부탁드립니다.</p>
                </div>
                <div className='col-md-4'>
                  <h4>퀵 배송비 관련</h4>
                  <p>- 서울 전 지역 무료 배송</p>
                  <p>- 1만원 추가지역: 구리 / 하남 / 성남 / 과천 / 의왕 / 군포 / 안양 / 광명 / 부천</p>
                  <p>- 2만원 추가지역: 김포 / 고양 / 파주 / 양주 / 광주 / 용인 / 남양주 / 오산 / 화성 / 안산 / 시흥 / 인천 / 수원 / 의정부</p>
                  <p>- 택배 배송 제품은 해당 안됩니다.</p>
                </div>
              </div>
            }
            { type === 'lesson' &&
              <div className='row'>
                <div className='col-md-4'>
                  <h4>안내사항</h4>
                  <p>- 레슨은 정확히 정시에 시작합니다. 다른 수강생 분들을 위해 10분 정도 미리 오셔서 준비해주세요.</p>
                  <p>- 꽃의 수급에 따라서 디자인은 조금 변경될 수도 있습니다.</p>
                  <p>- 생화상품이므로 퀵배송만 가능합니다. 현재 서울/경기 지역만 배송 가능합니다.</p>
                </div>
                <div className='col-md-4'>
                  <h4>취소 및 환불 관련</h4>
                  <p>- 생화를 취급하기 때문에 배송 전이라도 재료 구매 후에는 환불이 불가한 점 양해 부탁드립니다. 재료구매 문자 바송 후 취소는 불가능합니다.</p>
                  <p>- 재료 구매 전 날 일괄적으로 문자를 발송드립니다. 발송일 당일까지는 취소 가능합니다.</p>
                  <p>- 배송 이후에는 생화라는 특성 상 환불 불가능한 점 양해 부탁드립니다.</p>
                </div>
                <div className='col-md-4'>
                  <h4>퀵 배송비 관련</h4>
                  <p>- 서울 전 지역 무료 배송</p>
                  <p>- 1만원 추가지역: 구리 / 하남 / 성남 / 과천 / 의왕 / 군포 / 안양 / 광명 / 부천</p>
                  <p>- 2만원 추가지역: 김포 / 고양 / 파주 / 양주 / 광주 / 용인 / 남양주 / 오산 / 화성 / 안산 / 시흥 / 인천 / 수원 / 의정부</p>
                </div>
              </div>
            }
          </div>
        </section>
      )
    }
    const renderTutorSection = () => {
      return (
        <section className='section pv-40 stats'>
          <div className='container'>
            <div className='row'>
              <div className='main col-md-12'>
                <h2 className='page-title'>강사소개</h2>
                <div className='separator-2' />
                <div className='image-box team-member style-3-b'>
                  <div className='row'>
                    <div className='col-sm-6 col-md-4 col-lg-3'>
                      <div className='overlay-container overlay-visible'>
                        <img src={this.props.item.tutor.image} />
                      </div>
                    </div>
                    <div className='col-sm-6 col-md-8 col-lg-9'>
                      <div className='body'>
                        <h3 className='title'>{this.props.item.tutor.name} - <small>플로리스트</small></h3>
                        <div className='separator-2 mt-10' style={{ maxWidth: '300px' }} />
                        <p style={{ lineHeight: '1.8', fontSize: '17px' }}
                          dangerouslySetInnerHTML={{ __html: this.props.item.tutor.introduce }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }
    const renderPage = () => {
      if (!this.state.loading.isLoading) {
        return (
          <div>
            {renderProductSection()}
            {this.props.item.tutor && renderTutorSection()}
            {renderPolicySection()}
            {renderTabSection()}
          </div>
        )
      } else {
        return (
          <Loading text={`${this.state.loading.text}`} />
        )
      }
    }
    return (
      <div>
        {renderPage()}
        { type === 'lesson' &&
          <LessonRequestActionBlock />
        }
      </div>
    )
  }
}

ItemView.contextTypes = {
  router: React.PropTypes.object
}

ItemView.propTypes = {
  params: React.PropTypes.object.isRequired,
  item: React.PropTypes.object,
  fetchLesson: React.PropTypes.func,
  unselectLesson: React.PropTypes.func,
  fetchReviewsByGroupName: React.PropTypes.func,
  fetchItemInquiriesByGroupName: React.PropTypes.func,
  clearReviews: React.PropTypes.func,
  clearItemInquiries: React.PropTypes.func,
  reviews: React.PropTypes.object,
  inquiries: React.PropTypes.object,
  user: React.PropTypes.object,
  appendReviewsByGroupName: React.PropTypes.func,
  appendItemInquiriesByGroupName: React.PropTypes.func,
  relatedItems: React.PropTypes.array,
  fetchRelatedItems: React.PropTypes.func,
  fetchProduct: React.PropTypes.func,
  unselectProduct: React.PropTypes.func,
  fetchCartsByUserId: React.PropTypes.func.isRequired,
  carts: React.PropTypes.array,
  receiveOrderItem: React.PropTypes.func.isRequired,
  fetchUserByUserId: React.PropTypes.func.isRequired,
  setMessageModalShow: React.PropTypes.func.isRequired,
  setMessageModal: React.PropTypes.func.isRequired,
  setInquiryModal: React.PropTypes.func.isRequired,
  isAdmin: React.PropTypes.bool
}

export default ItemView
