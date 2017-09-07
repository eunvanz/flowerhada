import React from 'react'
import { Link } from 'react-router'
import { getDiscountPercentage } from 'common/util'
import numeral from 'numeral'
import { postCart, deleteCartByUserIdAndItemTypeAndItemIdAndCartType } from 'common/CartService'
import { fetchCartsByUserId } from 'store/cart'
import { connect } from 'react-redux'
import LessonDateInfo from 'components/LessonDateInfo'
import { groupFlower } from 'common/constants'
import Img from 'components/Img'

const mapStateToProps = state => ({
  user: state.user,
  cartList: state.cart.cartList
})

const mapDispatchToProps = {
  fetchCartsByUserId
}

class ProductItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wishProcess: false
    }
    this._handleOnClickAddToWishList = this._handleOnClickAddToWishList.bind(this)
    this._handleOnClickRemoveFromWishList = this._handleOnClickRemoveFromWishList.bind(this)
  }
  _handleOnClickAddToWishList () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    }
    // this.setState({ wishProcess: true })
    const cart = {
      userId: this.props.user.id,
      type: '위시리스트'
    }
    if (this.props.type === 'lesson') {
      cart.lessonId = this.props.item.id
    } else {
      cart.productId = this.props.item.id
    }
    postCart(cart)
    .then(() => {
      // this.setState({ wishProcess: false })
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  _handleOnClickRemoveFromWishList () {
    // this.setState({ wishProcess: true })
    const { item, user, type } = this.props
    deleteCartByUserIdAndItemTypeAndItemIdAndCartType(user.id, type, item.id, '위시리스트')
    .then(() => {
      // this.setState({ wishProcess: false })
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  render () {
    const { item, cartList, type } = this.props
    const renderPrice = () => {
      let returnComponent = null
      if (item.subCategory === '단체꽃다발') {
        returnComponent = (<span className='price'>
          <del>￦{`${numeral(item.price).format('0,0')}`}</del> ~ ￦<span>{`${numeral(item.price * (1 - groupFlower.DISCOUNT_RATE[3])).format('0,0')}`}</span>
        </span>)
      } else if (item.discountedPrice &&
      item.discountedPrice !== 0 &&
      item.discountedPrice !== item.price) {
        /* eslint-disable */
        returnComponent = (
          <span className='price'>
            <del>￦{`${numeral(item.price).format('0,0')}`}</del> ￦<span>{`${numeral(item.discountedPrice).format('0,0')}`}</span>
          </span>
        )
      } else if (item.price === 0) {
        returnComponent = (
          <span className='price'>￦ 별도문의</span>
        )
      } else {
        returnComponent = (
          <span className='price'>￦<span>{`${numeral(item.price).format('0,0')}`}</span></span>
        )
      }
      /* eslint-enable */
      return returnComponent
    }
    const renderBadges = () => {
      if (this.props.type === 'lesson' && item.expired) {
        return (
          <span className='badge' style={{ borderColor: '#d9534f', color: '#d9534f' }}>지난레슨</span>
        )
      } else if (this.props.type === 'lesson' && item.currParty === item.maxParty) {
        return (
          <span className='badge' style={{ borderColor: '#d9534f', color: '#d9534f' }}>등록마감</span>
        )
      } else if (this.props.type === 'lesson' && item.currParty >= item.maxParty - 2) {
        return (
          <span className='badge' style={{ borderColor: '#f0ad4e', color: '#f0ad4e' }}>마감임박</span>
        )
      } else if (this.props.type === 'product' && item.soldout) {
        return (
          <span className='badge' style={{ borderColor: '#d9534f', color: '#d9534f' }}>SOLD OUT</span>
        )
      } else if (item.discountedPrice &&
      item.discountedPrice !== 0 &&
      item.discountedPrice !== item.price) {
        return (
          <span className='badge' style={{ borderColor: '#09afdf', color: '#09afdf' }}>
            {
              `${getDiscountPercentage(item.price, item.discountedPrice)}% OFF`
            }
          </span>
        )
      }
    }
    const renderLocationBadge = () => {
      if (this.props.type === 'lesson') {
        return (
          <span className='default-bg badge' style={{ left: '10px', right: 'auto' }}>{item.location}</span>
        )
      }
    }
    const renderCategory = () => {
      if (this.props.type === 'product' && item.subCategory) {
        return (
          <p className='margin-clear'>
            <small>
              {item.mainCategory} <i className='fa fa-angle-right' /> {item.subCategory}
            </small>
          </p>
        )
      } else if (this.props.type === 'lesson') {
        return (
          <p className='margin-clear'>
            <small>
              플라워레슨 <i className='fa fa-angle-right' /> {item.mainCategory}
            </small>
          </p>
        )
      }
    }
    const renderTag = () => {
      if (this.props.type === 'lesson') {
        return (
          <p className='small'>
            <LessonDateInfo lesson={item} />
          </p>
        )
      }
    }
    const renderWishListButton = () => {
      if (this.state.wishProcess) {
        return (
          <i className='fa fa-circle-o-notch fa-spin fa-2x text-default pull-right' />
        )
      } else if (cartList && cartList.filter(cart => {
        if (type === 'lesson') return cart.lessonId === item.id && cart.type === '위시리스트'
        else return cart.productId === item.id && cart.type === '위시리스트'
      }).length > 0) {
        return (
          <i className='fa fa-heart fa-2x text-danger pull-right'
            onClick={this._handleOnClickRemoveFromWishList} style={{ cursor: 'pointer' }} />
        )
      } else {
        return (
          <i className='fa fa-heart-o fa-2x text-default pull-right'
            onClick={this._handleOnClickAddToWishList} style={{ cursor: 'pointer' }} />
        )
      }
    }
    return (
      <div className={`col-md-4 masonry-grid-item ${this.props.type === 'lesson' ? this.props.item.mainCategory : this.props.item.subCategory}`}>
        <div className='listing-item white-bg bordered mb-20'>
          <div className='overlay-container'>
            <Img src={item.titleImg} onLoad={this.props.onLoad} onError={this.props.onLoad} />
            <Link to={this.props.link || `/item/${this.props.type}/${item.id}`} className='overlay-link'>
              <i className='fa fa-search-plus' />
            </Link>
            {renderBadges()}
            {renderLocationBadge()}
            {/* <div className='overlay-to-top links'>
              <span className='small'>
                {renderWishListButton()}
              </span>
            </div> */}
          </div>
          <div className='body'>
            {renderCategory()}
            <h3 className='text-default'>
              <Link to={this.props.link || `/item/${this.props.type}/${item.id}`}
                className='text-default'>{item.title}</Link>
            </h3>
            <p>
              {item.detail}
            </p>
            {renderTag()}
            <div className='elements-list clearfix'>
              {renderPrice()}
              {/* <button className='pull-right margin-clear btn btn-sm btn-default-transparent btn-animated'>
                장바구니에 담기 <i className='fa fa-shopping-cart' />
              </button> */}
              {renderWishListButton()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProductItem.contextTypes = {
  router: React.PropTypes.object.isRequired
}

ProductItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
  user: React.PropTypes.object,
  fetchCartsByUserId: React.PropTypes.func.isRequired,
  cartList: React.PropTypes.array,
  link: React.PropTypes.string,
  onLoad: React.PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)
