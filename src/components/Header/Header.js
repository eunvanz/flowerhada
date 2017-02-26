import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { removeUser, fetchUser } from 'store/user'
import { removeAuthUser, receiveAuthUser } from 'store/authUser'
import { address, phone, email, facebook, instagram, ROOT } from 'common/constants'
import { fetchCartsByUserId, clearCarts } from 'store/cart'
import WishList from 'components/WishList'
import CartWindow from 'components/CartWindow'

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
  clearCarts
}

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Header'
    this._handleOnClickLogout = this._handleOnClickLogout.bind(this)
  }
  componentDidMount () {
    const sessionStorage = window.sessionStorage
    const authUser = JSON.parse(sessionStorage.getItem('authUser'))
    if (authUser) { // 세션에 authUser가 있을 경우 store에 세팅하고 db에서 user 가져옴
      this.props.receiveAuthUser(authUser)
      this.props.fetchUser(authUser.email)
      .then(() => {
        this.props.fetchCartsByUserId(this.props.user.id)
      })
    }
  }
  _handleOnClickLogout () {
    const sessionStorage = window.sessionStorage
    sessionStorage.removeItem('authUser')
    this.props.removeUser()
    this.props.removeAuthUser()
    this.props.clearCarts()
    this.context.router.push('/')
  }
  render () {
    const { cartList } = this.props
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
                        <Link to='/my-page' className='btn btn-default btn-sm' style={{ marginRight: '3px' }}>
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
                        <i className='fa fa-star' />
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
                  <div id='logo' className='logo'>
                    <IndexLink to='/'>
                      <img id='logo_img' src={`${ROOT}/template/images/logo_cool_green.png`} alt='flowerhada' />
                    </IndexLink>
                  </div>
                  <div className='site-slogan' style={{ marginLeft: '45px' }}>live florally</div>
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
                                  <Link to='/item-list/lesson/all'>전체</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/취미반'>취미반</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/창업반'>창업반</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/lesson/원데이레슨'>원데이레슨</Link>
                                </li>
                              </ul>
                            </li>
                            <li className='dropdown'>
                              <Link to='/item-list/flower/all' className='dropdown-toggle' data-toggle='dropdown'>
                                꽃다발
                              </Link>
                              <ul className='dropdown-menu'>
                                <li>
                                  <Link to='/item-list/flower/all'>전체</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/flower/단체꽃다발'>단체꽃다발</Link>
                                </li>
                                <li>
                                  <Link to='/item-list/flower/이벤트꽃다발'>이벤트꽃다발</Link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <Link to='/item-list/wedding/all'>
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
                                  <Link to='/lessons/hobby'>브랜드스토리</Link>
                                </li>
                                <li>
                                  <Link to='/lessons/business'>발자취</Link>
                                </li>
                              </ul>
                            </li>
                            {this.props.authUser.data &&
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
  cartList: PropTypes.array
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
