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

class ItemView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMap: false,
      quantity: 1,
      totalAmount: 0,
      tabActivated: 'review',
      commentModal: { show: false, type: 'review' },
      reviews: { curPage: 0, perPage: 5, isLoading: false },
      inquiries: { curPage: 0, perPage: 5, isLoading: false }
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
  }
  componentDidMount () {
    this._loadItemInfo()
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.params !== prevProps.params) {
      this._loadItemInfo()
    }
  }
  componentWillUnmount () {
    const type = this.props.params.type
    if (type === 'lesson') {
      this.props.unselectLesson()
    }
    this.props.clearInquiries()
    this.props.clearReviews()
  }
  _loadItemInfo () {
    const type = this.props.params.type
    if (type === 'lesson') {
      this.props.fetchLesson(this.props.params.id)
      .then(() => {
        this.props.fetchReviewsByGroupName(this.props.item.groupName,
          this.state.reviews.curPage, this.state.reviews.perPage)
      })
      .then(() => {
        this.props.fetchInquiriesByGroupName(this.props.item.groupName,
          this.state.reviews.curPage, this.state.reviews.perPage)
      })
      .then(() => {
        this.setState({ totalAmount: this.props.item.price })
        const recentItem = {
          id: this.props.item.id,
          type: 'lesson',
          mainCategory: this.props.item.mainCategory,
          subCategory: this.props.item.subCategory,
          title: this.props.item.title,
          titleImg: this.props.item.titleImg,
          price: this.props.item.price,
          discountedPrice: this.props.item.discountedPrice
        }
        setRecentItemToLocalStorage(recentItem)
      })
    }
  }
  _handleOnClickShowMap () {
    this.setState({ showMap: true })
  }
  _handleOnClickHideMap () {
    this.setState({ showMap: false })
  }
  _handleOnChangeQuantity (e) {
    const quantity = e.target.value
    const item = this.props.item
    this.setState({ quantity, totalAmount: item.price * quantity })
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
    return
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
    const renderSpecs = () => {
      if (type === 'lesson') {
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
              {`￦${numeral(item.price).format('0,0')} * `}
              <select className='form-control' id='quantity' value={this.state.quantity} onChange={this._handleOnChangeQuantity}>
                {renderLessonQuantity()}
              </select>
            </div>
          </div>
        )
        /* eslint-enable */
      }
    }
    const renderProductSection = () => {
      if (item) {
        /* eslint-disable */
        return (
          <section className='main-container'>
            <div className='container'>
              <div className='row'>
                <div className='main col-md-12'>
                  <h1 className='page-title'>레슨정보</h1>
                  <div className='separator-2' />
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='tab-content clear-style'>
                        <img src={item.titleImg} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <h2>{item.title}</h2>
                      <p>{item.detail}<LinkButton onClick={this._handleOnClickAddToWishList} textComponent={<span>위시리스트 담기 <i className='fa fa-heart' /></span>} /></p>
                      {renderSpecs()}
                      <div className='row grid-space-10'>
                        <div className='col-md-12'>
                          <form role='form' className='form-inline text-right'>
                            {renderOptions()}
                          </form>
                        </div>
                      </div>
                      <div className='light-gray-bg p-20 bordered clearfix'>
                        <span className='product price'>
                          <i className='icon-tag pr-10' />￦{numeral(this.state.totalAmount).format('0,0')}
                        </span>
                        <div className='product elements-list pull-right clearfix'>
                          <Button className='margin-clear' animated
                            textComponent={<span>장바구니에 담기 <i className='fa fa-shopping-cart' /></span>}
                            style={{ marginRight: '3px' }}
                          />
                          <Button className='margin-clear' animated color='dark'
                            textComponent={<span>바로구매 <i className='fa fa-credit-card-alt' /></span>}
                          />
                        </div>
                      </div>
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
        )
        /* eslint-enable */
      } else {
        return <div>loading...</div>
      }
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
      if (recentItems) {
        recentItems.reverse()
        returnComponent = recentItems.map(item => {
          return (
            <RecentItem key={keygen._()} item={item} />
          )
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
              <div className='col-md-8'>
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
    return (
      <div>
        {renderProductSection()}
        {renderPolicySection()}
        {renderTabSection()}
        <ActionBlock
          title='우리동네로 call hada'
          desc='내게 맞는 레슨이 없다고 좌절하지 마세요. 여러분이 원하는 지역과 시간대로 레슨을 개설해드립니다.'
          link='/apply-lesson'
          btnTxt='출장레슨 신청'
          btnIcon='fa fa-pencil-square-o pl-20'
        />
      </div>
    )
  }
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
  appendInquiriesByGroupName: React.PropTypes.func
}

export default ItemView
