import React, { PropTypes } from 'react'
import { IndexLink, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { removeUser, fetchUser } from 'store/user'
import { removeAuthUser, receiveAuthUser } from 'store/authUser'
import { address, phone, email, facebook, instagram, LOGO_FONT } from 'common/constants'
import { fetchCartsByUserId, clearCarts } from 'store/cart'
import WishList from 'components/WishList'
import CartWindow from 'components/CartWindow'
import { setInquiryModalMode, setInquiryModalShow,
  setInquiryModalAfterSubmit, setInquiryModalDefaultCategory } from 'store/inquiry'
import { setMessageModalShow, setMessageModalMessage, setMessageModalCancelBtnTxt, setMessageModalConfirmBtnTxt,
  setMessageModalOnConfirmClick } from 'store/messageModal'
import cookie from 'cookie'
import $ from 'jquery'
import { isScreenSize } from 'common/util'

const mapStateToProps = state => ({
  user: state.user,
  authUser: state.authUser,
  cartList: state.cart.cartList
})

const mapDispatchToProps = {
  removeUser,
  removeAuthUser,
  fetchUser,
  receiveAuthUser,
  fetchCartsByUserId,
  clearCarts,
  setInquiryModalMode,
  setInquiryModalShow,
  setInquiryModalAfterSubmit,
  setInquiryModalDefaultCategory,
  setMessageModalShow,
  setMessageModalMessage,
  setMessageModalCancelBtnTxt,
  setMessageModalConfirmBtnTxt,
  setMessageModalOnConfirmClick
}

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Header'
    this._handleOnClickLogout = this._handleOnClickLogout.bind(this)
    this._handleOnClickInquiry = this._handleOnClickInquiry.bind(this)
    this._collapseNav = this._collapseNav.bind(this)
  }
  componentDidMount () {
    // const sessionStorage = window.sessionStorage
    // const authUser = JSON.parse(sessionStorage.getItem('authUser'))
    const cookies = cookie.parse(document.cookie)
    let authUser = null
    if (cookies.authUser && cookies.authUser.indexOf('{') !== -1) authUser = JSON.parse(cookies.authUser)
    if (authUser) { // 세션에 authUser가 있을 경우 store에 세팅하고 db에서 user 가져옴
      this.props.receiveAuthUser(authUser)
      this.props.fetchUser(authUser.id)
      .then(() => {
        this.props.fetchCartsByUserId(this.props.user.id)
      })
    }

    /* eslint-disable */
    //Show dropdown on hover only for desktop devices
    //-----------------------------------------------
		const delay = 0
    let setTimeoutConst
    const Modernizr = window.Modernizr
		if ((!isScreenSize.xs() && !Modernizr.touch) || $('html.ie8').length > 0) {
			$('.main-navigation:not(.onclick) .navbar-nav>li.dropdown, .main-navigation:not(.onclick) li.dropdown>ul>li.dropdown').hover(
			() => {
				const $this = $(this)
				setTimeoutConst = setTimeout(function(){
					$this.addClass('open').slideDown()
					$this.find('.dropdown-toggle').addClass('disabled')
				}, delay)

			}, () => {
				window.clearTimeout(setTimeoutConst)
				$(this).removeClass('open')
				$(this).find('.dropdown-toggle').removeClass('disabled')
			})
		}

		//Show dropdown on click only for mobile devices
		//-----------------------------------------------
		// if (isScreenSize.xs() || $('.main-navigation.onclick').length > 0 ) {
		// 	$('.main-navigation [data-toggle=dropdown], .header-top [data-toggle=dropdown]').on('click', event => {
    //     console.log('clicked')
		// 	// Avoid following the href location when clicking
		// 	event.preventDefault()
		// 	// Avoid having the menu to close when clicking
		// 	event.stopPropagation()
		// 	// close all the siblings
		// 	$(this).parent().siblings().removeClass('open')
    //   console.log($(this))
    //   console.log($(this).parent().siblings())
		// 	// close all the submenus of siblings
		// 	$(this).parent().siblings().find('[data-toggle=dropdown]').parent().removeClass('open')
		// 	// opening the one you clicked on
		// 	$(this).parent().toggleClass('open')
		// 	})
		// }

    // Fixed header
		//-----------------------------------------------
		let headerTopHeight = $(".header-top").outerHeight()
		let headerHeight = $("header.header.fixed").outerHeight()
		$(window).resize(function() {
			if(($(this).scrollTop() < headerTopHeight + headerHeight -5 ) && ($(window).width() > 767)) {
				headerTopHeight = $(".header-top").outerHeight(),
				headerHeight = $("header.header.fixed").outerHeight()
			}
		})

		$(window).scroll(function() {
			if (($(".header.fixed:not(.fixed-before)").length > 0)  && !($(".transparent-header .slideshow").length>0)) {
				if (($(this).scrollTop() > headerTopHeight + headerHeight) && ($(window).width() > 767)) {
					$("body").addClass("fixed-header-on")
					$(".header.fixed:not(.fixed-before)").addClass('animated object-visible fadeInDown')
					$(".header-container").css("paddingBottom", (headerHeight)+"px")
				} else {
					$("body").removeClass("fixed-header-on")
					$(".header-container").css("paddingBottom", (0)+"px")
					$(".header.fixed:not(.fixed-before)").removeClass('animated object-visible fadeInDown')
				}
			} else if ($(".header.fixed:not(.fixed-before)").length > 0) {
				if (($(this).scrollTop() > headerTopHeight + headerHeight) && ($(window).width() > 767)) {
					$("body").addClass("fixed-header-on")
					$(".header.fixed:not(.fixed-before)").addClass('animated object-visible fadeInDown')
				} else {
					$("body").removeClass("fixed-header-on")
					$(".header.fixed:not(.fixed-before)").removeClass('animated object-visible fadeInDown')
				}
			}
		})

		$(window).scroll(function() {
			if (($(".header.fixed.fixed-before").length > 0)  && !($(".transparent-header .slideshow").length>0)) {
				if (($(this).scrollTop() > headerTopHeight) && ($(window).width() > 767)) {
					$("body").addClass("fixed-header-on")
					$(".header.fixed.fixed-before").addClass('object-visible')
					$(".header-container").css("paddingBottom", (headerHeight)+"px")
				} else {
					$("body").removeClass("fixed-header-on")
					$(".header-container").css("paddingBottom", (0)+"px")
					$(".header.fixed.fixed-before").removeClass('object-visible')
				}
			} else if ($(".header.fixed.fixed-before").length > 0) {
				if (($(this).scrollTop() > headerTopHeight) && ($(window).width() > 767)) {
					$("body").addClass("fixed-header-on")
					$(".header.fixed.fixed-before").addClass('object-visible')
				} else {
					$("body").removeClass("fixed-header-on")
					$(".header.fixed.fixed-before").removeClass('object-visible')
				}
			}
		})
    /* eslint-enable */
  }
  _handleOnClickLogout () {
    // const sessionStorage = window.sessionStorage
    // sessionStorage.removeItem('authUser')
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() - 1)
    document.cookie = `authUser=; expires=${expireDate.toGMTString()}; path=/;`
    this.props.removeUser()
    this.props.removeAuthUser()
    this.props.clearCarts()
    browserHistory.push('/')
  }
  _handleOnClickInquiry () {
    this.props.setInquiryModalDefaultCategory('분류선택')
    this.props.setInquiryModalAfterSubmit(() => {
      let message =
        this.props.user ? '문의가 완료되었습니다. 문의 내역은 마이페이지 > 1:1문의 에서도 확인하실 수 있습니다.' : '문의가 완료되었습니다. 빠른 시일 내에 답변드리겠습니다.'
      this.props.setMessageModalMessage(message)
      this.props.setMessageModalCancelBtnTxt(null)
      this.props.setMessageModalConfirmBtnTxt('확인')
      this.props.setMessageModalOnConfirmClick(() => this.props.setMessageModalShow(false))
      this.props.setMessageModalShow(true)
    })
    this.props.setInquiryModalMode('post')
    this.props.setInquiryModalShow(true)
  }
  _collapseNav () {
    const navToggleBtn = $('.navbar-toggle')
    if (navToggleBtn.attr('aria-expanded') !== 'false') {
      navToggleBtn.click()
    }
  }
  render () {
    const { cartList } = this.props
    const getMarginFromFont = () => {
      if (LOGO_FONT === 'Niccone') {
        return 45
      } else if (LOGO_FONT === 'Damion') {
        return 52
      }
      return 45
    }
    return (
      <div className='header-container'>
        <div className='header-top dark'>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-3 col-sm-6 col-md-9'>
                <div className='header-top-first clearfix'>
                  {/* Social Links Start */}
                  <ul className='social-links circle small clearfix hidden-xs'>
                    <li className='facebook'>
                      <a href={facebook} target='_blank'>
                        <i className='fa fa-facebook' style={{ cursor: 'pointer' }} />
                      </a>
                    </li>
                    <li className='flickr'>
                      <a href={instagram} target='_balnk'>
                        <i className='fa fa-instagram' style={{ cursor: 'pointer' }} />
                      </a>
                    </li>
                  </ul>
                  <div className='social-links hidden-lg hidden-md hidden-sm circle small'>
                    <div className='btn-group dropdown'>
                      <button type='button' className='btn dropdown-toggle' data-toggle='dropdown'>
                        <i className='fa fa-share-alt' />
                      </button>
                      <ul className='dropdown-menu dropdown-animation' style={{ minWidth: '76px' }}>
                        <li className='facebook'>
                          <a href='http://www.facebook.com' target='_blank'>
                            <i className='fa fa-facebook' style={{ cursor: 'pointer' }} />
                          </a>
                        </li>
                        <li className='flickr'>
                          <a href='http://instagram.com/flowerhada' target='_blank'>
                            <i className='fa fa-instagram' style={{ cursor: 'pointer' }} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Social Links End */}
                  {/* Contact Info Start */}
                  <ul className='list-inline hidden-sm hidden-xs'>
                    <li>
                      <i className='fa fa-map-marker pr-5 pl-10' />{address}
                    </li>
                    <li>
                      <i className='fa fa-phone pr-5 pl-10' />{phone}
                    </li>
                    <li>
                      <i className='fa fa-envelope-o pr-5 pl-10' />{email}
                    </li>
                  </ul>
                  {/* Contact Info End */}
                </div>
              </div>
              <div className='col-xs-9 col-sm-6 col-md-3'>
                <div id='header-top-second' className='clearfix'>
                  {!this.props.user &&
                    <div className='header-top-dropdown text-right'>
                      <div className='btn-group'>
                        <Link to='/sign-up' className='btn btn-default btn-sm' style={{ marginRight: '3px' }}>
                          <i className='fa fa-user pr-10' /> 회원가입
                        </Link>
                      </div>
                      <div className='btn-group'>
                        <Link to='/login'>
                          <button // eslint-disable-line
                            type='button'
                            className='btn btn-default btn-sm'
                          >
                            <i className='fa fa-lock pr-10' /> 로그인
                          </button>
                        </Link>
                      </div>
                    </div>
                  }
                  {this.props.user &&
                    <div className='header-top-dropdown text-right'>
                      <div className='btn-group'>
                        <Link to='/my-page/profile' className='btn btn-default btn-sm' style={{ marginRight: '3px' }}>
                          <i className='fa fa-user pr-10' /> 마이페이지
                        </Link>
                      </div>
                      <div className='btn-group'>
                        <button // eslint-disable-line
                          type='button'
                          className='btn btn-default btn-sm'
                          onClick={this._handleOnClickLogout}
                        >
                          <i className='fa fa-sign-out pr-10' /> 로그아웃
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <header className='header fixed clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-4'>
                <div className='header-left clearfix'>
                  <div className='header-dropdown-buttons visible-xs'>
                    <div className='btn-group dropdown'>
                      <button type='button' id='wishListBtnSm' className='btn dropdown-toggle' data-toggle='dropdown'>
                        <i className='fa fa-heart' />
                        <span className='cart-count default-bg'>
                          {!cartList ? '0' : cartList.filter(cart => cart.type === '위시리스트').length}
                        </span>
                      </button>
                      <WishList buttonIdToBind='wishListBtnSm' items={cartList && cartList.filter(cart => cart.type === '위시리스트')} />
                    </div>
                    {/* <div className='btn-group dropdown'>
                      <button type='button' className='btn dropdown-toggle' data-toggle='dropdown'>
                        <i className='icon-search' />
                      </button>
                      <ul className='dropdown-menu dropdown-menu-right dropdown-animation'>
                        <li>
                          <form role='search' className='search-box margin-clear'>
                            <div className='form-group has-feedback'>
                              <input type='text' className='form-control' placeholder='Search' />
                              <i className='icon-search form-control-feedback' />
                            </div>
                          </form>
                        </li>
                      </ul>
                    </div> */}
                    <div className='btn-group dropdown'>
                      <button type='button' className='btn dropdown-toggle cart-btn' data-toggle='dropdown'>
                        <i className='icon-basket-1' />
                        <span className='cart-count default-bg'>
                          {!cartList ? '0' : cartList.filter(cart => cart.type === '장바구니').length}
                        </span>
                      </button>
                      <CartWindow items={cartList && cartList.filter(cart => cart.type === '장바구니')} />
                    </div>
                  </div>
                  <div id='logo' className='logo hidden-sm' style={{ marginTop: '4px' }}>
                    <IndexLink to='/' style={{ textDecoration: 'none' }} onClick={this._collapseNav}>
                      <i className='text-muted' style={{ fontFamily: `${LOGO_FONT}, cursive`, lineHeight: '28px', fontSize: '38px', fontStyle: 'normal' }}>flower<span className='text-default'>hada</span></i>
                    </IndexLink>
                  </div>
                  <div id='logo' className='logo visible-sm' style={{ marginTop: '4px', textAlign: 'center' }}>
                    <IndexLink to='/' style={{ textDecoration: 'none' }} onClick={this._collapseNav}>
                      <i className='text-muted' style={{ fontFamily: `${LOGO_FONT}, cursive`, lineHeight: '28px', fontSize: '38px', fontStyle: 'normal' }}>flower<span className='text-default'>hada</span></i>
                    </IndexLink>
                  </div>
                  <div className='site-slogan hidden-sm text-muted' style={{ marginLeft: `${getMarginFromFont()}px`, textAlign: 'left' }}>live florally</div>
                  <div className='site-slogan visible-sm text-muted' style={{ textAlign: 'center' }}>live florally</div>
                </div>
              </div>
              <div className='col-md-8'>
                <div className='header-right clearfix'>
                  <div className='main-navigation animated with-dropdown-buttons'>
                    <nav className='navbar navbar-default' role='navigation'>
                      <div className='container-fluid'>
                        <div className='navbar-header'>
                          <button // eslint-disable-line
                            type='button'
                            className='navbar-toggle'
                            data-toggle='collapse'
                            data-target='#navbar-collapse-1'
                            aria-expanded='false'
                          >
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                          </button>
                        </div>
                        <div className='navbar-collapse collapse' id='navbar-collapse-1' aria-expanded='true'>
                          <ul className='nav navbar-nav'>
                            <li className='dropdown'>
                              <Link to='/item-list/lesson/all' className='dropdown-toggle' data-toggle='dropdown'>
                                플라워레슨
                              </Link>
                              <ul className='dropdown-menu'>
                                <li>
                                  <Link to='/item-list/lesson/all' onClick={this._collapseNav}>전체</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/취미반' onClick={this._collapseNav}>취미반</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/창업반' onClick={this._collapseNav}>창업반</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/원데이레슨' onClick={this._collapseNav}>원데이레슨</Link>
                                </li>
                              </ul>
                            </li>
                            <li className='dropdown'>
                              <Link to='/item-list/flower/all' className='dropdown-toggle' data-toggle='dropdown'>
                                꽃다발
                              </Link>
                              <ul className='dropdown-menu'>
                                <li>
                                  <Link to='/item-list/flower/all' onClick={this._collapseNav}>전체</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/flower/단체꽃다발' onClick={this._collapseNav}>단체꽃다발</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/flower/이벤트꽃다발' onClick={this._collapseNav}>이벤트꽃다발</Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <Link to='/item-list/wedding/all' onClick={this._collapseNav}>
                                웨딩
                              </Link>
                            </li>
                            {/* <li>
                              <Link to='/lessons' className='dropdown-toggle' data-toggle='dropdown'>
                                이벤트
                              </Link>
                            </li>
                            <li>
                              <Link to='/lessons' className='dropdown-toggle' data-toggle='dropdown'>
                                갤러리
                              </Link>
                            </li> */}
                            <li className='dropdown'>
                              <Link to='/lessons' className='dropdown-toggle' data-toggle='dropdown'>
                                hada STORY
                              </Link>
                              <ul className='dropdown-menu'>
                                <li>
                                  <Link to='/lessons/hobby' onClick={this._collapseNav}>브랜드 스토리</Link>
                                </li>
                                <li>
                                  <Link to='/lessons/business' onClick={this._collapseNav}>hada NEWS</Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <a id='inquiryBtn' onClick={this._handleOnClickInquiry} style={{ cursor: 'pointer' }}>
                                1:1 문의
                              </a>
                            </li>
                            {this.props.authUser.data && this.props.authUser.data.authorities[1] &&
                              this.props.authUser.data.authorities[1].authority === 'ADMIN' &&
                              <li className='dropdown'>
                                <Link to='/admin' className='dropdown-toggle' data-toggle='dropdown'>
                                  관리자
                                </Link>
                                <ul className='dropdown-menu'>
                                  <li>
                                    <Link to='/admin/main-banner'>매인배너</Link>
                                  </li>
                                  <li>
                                    <Link to='/admin/lesson'>레슨</Link>
                                  </li>
                                  <li>
                                    <Link to='/admin/product'>상품</Link>
                                  </li>
                                  <li>
                                    <Link to='/admin/order-list'>주문관리</Link>
                                  </li>
                                  <li>
                                    <Link to='/admin/error-list'>오류관리</Link>
                                  </li>
                                  <li>
                                    <Link to='/admin/user-list'>회원</Link>
                                  </li>
                                </ul>
                              </li>
                            }
                          </ul>
                          <div className='header-dropdown-buttons hidden-xs'>
                            <div className='btn-group dropdown'>
                              <button type='button' className='btn dropdown-toggle' data-toggle='dropdown'
                                id='wishListBtn'>
                                <i className='fa fa-heart' />
                                <span className='cart-count default-bg'>
                                  {!cartList ? '0' : cartList.filter(cart => cart.type === '위시리스트').length}
                                </span>
                              </button>
                              <WishList buttonIdToBind='wishListBtn'
                                items={cartList && cartList.filter(cart => cart.type === '위시리스트')} />
                            </div>
                            {/* <div className='btn-group dropdown'>
                              <button type='button' className='btn dropdown-toggle' data-toggle='dropdown'>
                                <i className='icon-search' />
                              </button>
                              <ul className='dropdown-menu dropdown-menu-right dropdown-animation'>
                                <li>
                                  <form role='search' className='search-box margin-clear'>
                                    <div className='form-group has-feedback'>
                                      <input type='text' className='form-control' placeholder='검색' />
                                      <i className='icon-search form-control-feedback' />
                                    </div>
                                  </form>
                                </li>
                              </ul>
                            </div> */}
                            <div className='btn-group dropdown'>
                              <button type='button' className='btn dropdown-toggle cart-btn' data-toggle='dropdown'>
                                <i className='icon-basket-1' />
                                <span className='cart-count default-bg'>
                                  {!cartList ? '0' : cartList.filter(cart => cart.type === '장바구니').length}
                                </span>
                              </button>
                              <CartWindow items={cartList && cartList.filter(cart => cart.type === '장바구니')} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

Header.contextType = {
  router: PropTypes.object.isRequired
}

Header.propTypes = {
  user: PropTypes.object,
  removeUser: PropTypes.func.isRequired,
  removeAuthUser: PropTypes.func.isRequired,
  authUser: PropTypes.object,
  receiveAuthUser: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchCartsByUserId: PropTypes.func.isRequired,
  clearCarts: PropTypes.func.isRequired,
  cartList: PropTypes.array,
  setInquiryModalMode: PropTypes.func.isRequired,
  setInquiryModalShow: PropTypes.func.isRequired,
  setInquiryModalAfterSubmit: PropTypes.func.isRequired,
  setInquiryModalDefaultCategory: PropTypes.func.isRequired,
  setMessageModalShow: PropTypes.func.isRequired,
  setMessageModalMessage: PropTypes.func.isRequired,
  setMessageModalCancelBtnTxt: PropTypes.func.isRequired,
  setMessageModalConfirmBtnTxt: PropTypes.func.isRequired,
  setMessageModalOnConfirmClick: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
