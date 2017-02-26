import React from 'react'
import { convertDateToString, extractDaysFromLessonDays, extractDetailScheduleFromLessonDays,
  setRecentItemToLocalStorage } from 'common/util'
import MapModal from 'components/MapModal'
import numeral from 'numeral'
import ActionBlock from 'components/ActionBlock'
import LinkButton from 'components/LinkButton'
import Comment from 'components/Comment'
import $ from 'jquery'
import CommentModal from 'components/CommentModal'
import keygen from 'keygenerator'
import Button from 'components/Button'
import RecentItem from 'components/RecentItem'
import Alert from 'components/Alert'
import Loading from 'components/Loading'
import TextField from 'components/TextField'
import ImageCarousel from 'components/ImageCarousel'
import Parallax from 'components/Parallax'
import DatePicker from 'components/DatePicker'
import { deleteCartByUserIdAndItemTypeAndItemIdAndCartType, postCart } from 'common/CartService'

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
      receiveDate: date.toISOString(),
      receiveTime: '오전 10시 ~ 오전 12시'
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
  }
  componentDidMount () {
    window.scrollTo(0, 0)
    if (this._isValidPage()) {
      this._loadItemInfo()
    } else {
      this.context.router.push('/not-found')
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.params !== prevProps.params) {
      this._unselectItem()
      this._initializeState()
      this._loadItemInfo()
      window.scrollTo(0, 0)
    }
  }
  componentWillUnmount () {
    this._unselectItem(this.props.params.type)
    this.props.clearInquiries()
    this.props.clearReviews()
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
      receiveDate: date.toISOString(),
      receiveTime: '오전 10시 ~ 오전 12시'
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
    fetchItem(this.props.params.id)
    .then(() => {
      if (!this.props.item) {
        this.context.router.push('/not-found')
        return
      }
      this.setState({ itemPrice: this.props.item.price })
      this.props.fetchReviewsByGroupName(this.props.item.groupName,
        this.state.reviews.curPage, this.state.reviews.perPage)
    })
    .then(() => {
      this.props.fetchInquiriesByGroupName(this.props.item.groupName,
        this.state.reviews.curPage, this.state.reviews.perPage)
    })
    .then(() => {
      this.props.fetchRelatedItems(this.props.item, type)
    })
    .then(() => {
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
      setRecentItemToLocalStorage(recentItem)
      this.setState({ loading: { isLoading: false } })
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
    if (quantity < 1) quantity = 1
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
    const wishList = new URLSearchParams()
    wishList.append('userId', user.id)
    if (params.type === 'lesson') {
      wishList.append('lessonId', item.id)
    } else {
      wishList.append('productId', item.id)
    }
    wishList.append('type', '위시리스트')
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
      ? this.props.fetchReviewsByGroupName : this.props.fetchInquiriesByGroupName
    action(this.props.item.groupName, 0, this.state.reviews.perPage)
  }
  _handleOnClickMoreList () {
    const commentType = this.state.tabActivated === 'review' ? 'reviews' : 'inquiries'
    const appendList = this.state.tabActivated === 'review'
      ? this.props.appendReviewsByGroupName : this.props.appendInquiriesByGroupName
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
    let receiveDate = value
    const today = new Date()
    const theDayAfterTomorrow = new Date(today.valueOf() + (24 * 60 * 60 * 1000 * 2)).toISOString()
    if (value < theDayAfterTomorrow) receiveDate = theDayAfterTomorrow
    this.setState({ receiveDate: receiveDate })
  }
  _handleOnChangeInput (e) {
    const id = e.target.id
    const value = e.target.value
    const name = value.split(':')[0]
    const price = Number(value.split(':')[1])
    this.setState({ [id]: { name, price } })
  }
  _getItemPrice = () => {
    return (this.props.item.discountedPrice === 0 ? this.props.item.price : this.props.item.discountedPrice) +
      this.state.option1.price + this.state.option2.price + this.state.option3.price
  }
  _getTotalPrice = () => {
    return this._getItemPrice() * this.state.quantity
  }
  _handleOnClickAddToCart () {
    const { user, params, item, fetchCartsByUserId } = this.props
    const cart = new URLSearchParams()
    cart.append('userId', user.id)
    if (params.type === 'lesson') {
      cart.append('lessonId', item.id)
    } else {
      cart.append('productId', item.id)
    }
    cart.append('quantity', this.state.quantity)
    cart.append('type', '장바구니')
    const options = []
    options.push(this.state.option1)
    options.push(this.state.option2)
    options.push(this.state.option3)
    cart.append('options', JSON.stringify(options))
    cart.append('totalAmount', this._getTotalPrice())
    cart.append('itemPrice', this._getItemPrice())
    postCart(cart)
    .then(() => {
      return fetchCartsByUserId(user.id)
    })
    .then(() => {
      $('.cart-btn').click()
    })
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
                <i className='fa fa-angle-down' /> <span className='text-default'>
                  {this.props.reviews.totalPages - 1 -
                  this.props.reviews.number === 1 ? this.props.reviews.totalElements -
                  (this.props.reviews.number + 1) * this.props.reviews.numberOfElements
                  : this.props.reviews.numberOfElements}</span>건 더 보기
              </span>
            }
          />
        )
      }
    }
    const renderShowMoreInquiriesButton = () => {
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
    const renderSpecs = () => {
      if (item.lessonDate || item.lessonDays && type === 'lesson') {
        /* eslint-disable */
        return (
          <table className='table' style={{ marginBottom: '0px' }}>
            <tbody>
              <tr>
                <td className='text-right' style={{ width: '90px' }}><strong>모집인원</strong></td>
                <td>최대 <span className='text-default'>{item.maxParty}</span>명, 현재 <span className='text-default'>{item.currParty}</span>명 등록 중</td>
              </tr>
              {
                !item.oneday &&
                <tr>
                  <td className='text-right'><strong>레슨일정</strong></td>
                  <td>오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>부터 <span className='text-default'>{`${item.weekType} ${extractDaysFromLessonDays(item.lessonDays)}요일`}</span>에 <span className='text-default'>{item.weekLong}주간</span> 진행</td>
                </tr>
              }
              {
                !item.oneday &&
                <tr>
                  <td className='text-right'><strong>레슨시간</strong></td>
                  <td>{extractDetailScheduleFromLessonDays(item.lessonDays).map(elem => <div key={keygen._()}>{elem}<br /></div>)}</td>
                </tr>
              }
              {
                item.oneday &&
                <tr>
                  <td className='text-right'><strong>레슨일정</strong></td>
                  <td>오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>에 진행되는 <span className='text-default'>원데이레슨</span></td>
                </tr>
              }
              <tr>
                <td className='text-right'><strong>장소</strong></td>
                <td>{`${item.address} ${item.restAddress} `}<LinkButton onClick={this._handleOnClickShowMap} textComponent={<span>지도보기 <i className='fa fa-map-marker' /></span>} /></td>
              </tr>
            </tbody>
          </table>
        )
        /* eslint-enable */
      } else if (item.mainCategory === '꽃다발') {
        return (
          <table className='table' style={{ marginBottom: '0px' }}>
            <tbody>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령일</strong></td>
                <td>
                  <DatePicker
                    id='receiveDate'
                    onChange={this._handleOnChangeDate}
                    value={this.state.receiveDate}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령시간</strong></td>
                <td>
                  <select className='form-control' id='receiveTime' style={{ width: '200px' }}
                    value={this.state.receiveTime} onChange={this._handleOnChangeInput}>
                    {renderTimeOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>옵션</strong></td>
                <td>
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
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령일</strong></td>
                <td>
                  <DatePicker
                    id='receiveDate'
                    onChange={this._handleOnChangeDate}
                    value={this.state.receiveDate}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령시간</strong></td>
                <td>
                  <select className='form-control' id='receiveTime' style={{ width: '200px' }}
                    value={this.state.receiveTime} onChange={this._handleOnChangeInput}>
                    {renderTimeOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>코사지</strong></td>
                <td>
                  <select className='form-control' id='option1' style={{ width: '200px' }}
                    value={this.state.option1.name + ':' + this.state.option1.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='코사지1:8000'>코사지1 (+8,000)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>부토니에</strong></td>
                <td>
                  <select className='form-control' id='option2' style={{ width: '200px' }}
                    value={this.state.option2.name + ':' + this.state.option2.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='부토니에1:8000' data-price={8000}>부토니에1 (+8,000)</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className='text-right' style={{ width: '120px', paddingTop: '18px' }}><strong>플라워샤워</strong></td>
                <td>
                  <select className='form-control option' id='option3' style={{ width: '200px' }}
                    value={this.state.option3.name + ':' + this.state.option3.price}
                    onChange={this._handleOnChangeInput}>
                    <option value='선택안함:0'>선택안함</option>
                    <option value='플라워샤워:8000' data-price={8000}>플라워샤워 (+8,000)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        )
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
              {`￦${numeral(this._getItemPrice()).format('0,0')} `}<i className='fa fa-times-circle' />{' '}
              <TextField style={{ width: '50px', paddingRight: '5px', paddingLeft: '5px' }} type='number' id='quantity' value={this.state.quantity} onChange={this._handleOnChangeQuantity} /> 개
            </div>
          </div>
        )
        /* eslint-enable */
      }
    }
    const renderPrice = () => {
      if (item.expired) {
        return <Alert type='warning' text='신청 기간이 지난 레슨입니다. 다음 번엔 좀 더 서두르세요!' />
      } else if (item.soldOut) {
        return <Alert type='warning' text='일시적으로 품절된 상품입니다. 다음 번엔 좀 더 서두르세요!' />
      } else if (type === 'lesson' && item.maxParty <= item.currParty) {
        return <Alert type='warning' text='인원이 모두 차버렸네요. 다른 레슨을 찾아보세요.' />
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
              <span className='product price'>
                <i className='icon-tag pr-10' />￦<span className='text-default'>{numeral(this._getTotalPrice()).format('0,0')}</span>
              </span>
              <div className='product elements-list pull-right clearfix'>
                <Button className='margin-clear' animated onClick={this._handleOnClickAddToCart}
                  textComponent={<span>장바구니에 담기 <i className='fa fa-shopping-cart' /></span>}
                  style={{ marginRight: '3px' }}
                />
                <Button className='margin-clear' animated color='dark'
                  textComponent={<span>바로구매 <i className='fa fa-credit-card-alt' /></span>}
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
        returnComponent = <ImageCarousel images={JSON.parse(item.images)} />
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
                  <h1 className='page-title'>{type === 'lesson' ? '레슨정보' : '상품정보'}</h1>
                  <div className='separator-2' />
                  <div className='row'>
                    <div className='col-md-6' style={{ marginBottom: '40px' }}>
                      {renderImages()}
                    </div>
                    <div className='col-md-6'>
                      <h2>{item.title}</h2>
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
                  <h1 className='page-title'>세부정보</h1>
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
            afterSubmit={this._handleOnSubmitComplete} afterDelete={this._handleOnSubmitComplete} />)
      }
      return returnComponent || <div className='text-center'>후기가 없습니다.</div>
    }
    const renderInquiries = () => {
      let returnComponent = null
      if (this.props.inquiries && this.props.inquiries.content && this.props.inquiries.content.length > 0) {
        returnComponent = this.props.inquiries.content.map(inquiry =>
          <Comment item={inquiry} key={keygen._()} userId={this.props.user ? this.props.user.id : null}
            afterSubmit={this._handleOnSubmitComplete} afterDelete={this._handleOnSubmitComplete} />)
      }
      return returnComponent || <div className='text-center'>문의가 없습니다.</div>
    }
    const renderRecentItems = () => {
      let returnComponent = <div className='text-center'>최근 본 상품이 없습니다.</div>
      const localStorage = window.localStorage
      const recentItems = JSON.parse(localStorage.getItem('recentItems'))
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
                      {
                        this.props.user &&
                        <div className='pull-right'>
                          <Button
                            color='dark'
                            onClick={this._handleOnClickWriteComment}
                            animated
                            textComponent={
                              <span>
                                후기작성 <span className='text-default'>+1000P</span> <i className='fa fa-pencil' />
                              </span>
                            }
                          />
                        </div>
                      }
                    </div>
                  </div>
                  <div className='tab-pane fade' id='inquiryPane'>
                    <div className='comments margin-clear space-top'>
                      {renderInquiries()}
                      {renderShowMoreInquiriesButton()}
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
                  id='registerComment'
                />
              }
              <div className='col-md-4 col-lg-3 col-lg-offset-1'>
                <div className='sidebar'>
                  <div className='bolck clearfix' style={{ marginBottom: '40px' }}>
                    <h3 className='title'>관련된 상품</h3>
                    <div className='separator-2'></div>
                    {renderRelatedItems()}
                  </div>
                  <div className='bolck clearfix'>
                    <h3 className='title'>최근 본 상품</h3>
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
            <div className='row'>
              <div className='col-md-4'>
                <h4>안내사항</h4>
                <p>[정시 시작] 클래스는 정시에 바로 시작합니다. 함께 들으시는 분들을 위해 10분 정도 미리 오셔서 준비해주세요.</p>
                <p>[문자 안내] 매 수업일 2일 전에 문자를 통해 확인 및 안내를 드립니다.</p>
                <p>[신청 확인] ‘마이페이지’에서 신청 현황을 확인할 수 있습니다.</p>
              </div>
              <div className='col-md-4'>
                <h4>주문 및 취소, 환불 정책</h4>
                <p>[정시 시작] 클래스는 정시에 바로 시작합니다. 함께 들으시는 분들을 위해 10분 정도 미리 오셔서 준비해주세요.</p>
                <p>[문자 안내] 매 수업일 2일 전에 문자를 통해 확인 및 안내를 드립니다.</p>
                <p>[신청 확인] ‘마이페이지’에서 신청 현황을 확인할 수 있습니다.</p>
              </div>
              <div className='col-md-4'>
                <h4>주의사항</h4>
                <p>[정시 시작] 클래스는 정시에 바로 시작합니다. 함께 들으시는 분들을 위해 10분 정도 미리 오셔서 준비해주세요.</p>
                <p>[문자 안내] 매 수업일 2일 전에 문자를 통해 확인 및 안내를 드립니다.</p>
                <p>[신청 확인] ‘마이페이지’에서 신청 현황을 확인할 수 있습니다.</p>
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
            {renderPolicySection()}
            {renderTabSection()}
          </div>
        )
      } else {
        return (
          <Loading text={`${this.state.text}`} />
        )
      }
    }
    return (
      <div>
        {renderPage()}
        { type === 'lesson' &&
          <ActionBlock
            title='우리동네로 call hada'
            desc='내게 맞는 레슨이 없다고 좌절하지 마세요. 여러분이 원하는 지역과 시간대로 레슨을 개설해드립니다.'
            link='/apply-lesson'
            btnTxt='출장레슨 신청'
            btnIcon='fa fa-pencil-square-o pl-20'
          />
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
  fetchInquiriesByGroupName: React.PropTypes.func,
  clearReviews: React.PropTypes.func,
  clearInquiries: React.PropTypes.func,
  reviews: React.PropTypes.object,
  inquiries: React.PropTypes.object,
  user: React.PropTypes.object,
  appendReviewsByGroupName: React.PropTypes.func,
  appendInquiriesByGroupName: React.PropTypes.func,
  relatedItems: React.PropTypes.array,
  fetchRelatedItems: React.PropTypes.func,
  fetchProduct: React.PropTypes.func,
  unselectProduct: React.PropTypes.func,
  fetchCartsByUserId: React.PropTypes.func.isRequired,
  carts: React.PropTypes.array
}

export default ItemView
