import React from 'react'
import { Link } from 'react-router'
import { getDiscountPercentage } from 'common/util'
import numeral from 'numeral'
import { postCart, deleteCartByUserIdAndItemTypeAndItemIdAndCartType } from 'common/CartService'
import { fetchCartsByUserId } from 'store/cart'
import { connect } from 'react-redux'
import Button from 'components/Button'
import LessonDateInfo from 'components/LessonDateInfo'

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
    this._handleOnClickAddToWishList = this._handleOnClickAddToWishList.bind(this)
    this._handleOnClickRemoveFromWishList = this._handleOnClickRemoveFromWishList.bind(this)
  }
  _handleOnClickAddToWishList () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    }
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
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  _handleOnClickRemoveFromWishList () {
    const { item, user, type } = this.props
    deleteCartByUserIdAndItemTypeAndItemIdAndCartType(user.id, type, item.id, '위시리스트')
    .then(() => {
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
  }
  render () {
    const { item, cartList, type } = this.props
    const renderPrice = () => {
      let returnComponent = null
      if (item.discountedPrice &&
      item.discountedPrice !== 0 &&
      item.discountedPrice !== item.price) {
        /* eslint-disable */
        returnComponent = (
          <span className='price'>
            <del>￦{`${numeral(item.price).format('0,0')}`}</del> ￦<span className='text-default'>{`${numeral(item.discountedPrice).format('0,0')}`}</span>
          </span>
        )
      } else {
        returnComponent = (
          <span className='price'>￦<span className='text-default'>{`${numeral(item.price).format('0,0')}`}</span></span>
        )
      }
      /* eslint-enable */
      return returnComponent
    }
    const renderDiscountBadge = () => {
      if (item.discountedPrice &&
      item.discountedPrice !== 0 &&
      item.discountedPrice !== item.price) {
        return (
          <span className='badge'>
            {
              `${getDiscountPercentage(item.price, item.discountedPrice)}% OFF`
            }
          </span>
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
    // const renderDateInfo = () => {
    //   let returnComponent = null
    //   if (item.oneday) {
    //     /* eslint-disable */
    //     returnComponent = (
    //       <span>오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>에 진행되는 <span className='text-default'>원데이레슨</span></span>
    //     )
    //   } else {
    //     returnComponent = (
    //       <span>
    //         오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>부터 <span className='text-default'>{`${item.weekType} ${extractDaysFromLessonDays(item.lessonDays)}요일`}</span>에 <span className='text-default'>{item.weekLong}주간</span> 진행
    //       </span>
    //     )
    //     /* eslint-enable */
    //   }
    //   return returnComponent
    // }
    const renderTag = () => {
      if (this.props.type === 'lesson') {
        return (
          <p className='small'>
            <LessonDateInfo lesson={item} />
          </p>
        )
      }
    }
    // const renderWishListButton = () => {
    //   if (cartList && cartList.filter(cart => {
    //     if (type === 'lesson') return cart.lessonId === item.id && cart.type === '위시리스트'
    //     else return cart.productId === item.id && cart.type === '위시리스트'
    //   }).length > 0) {
    //     return (
    //       <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickRemoveFromWishList}>
    //         <i className='fa fa-times pr-10' /> 위시리스트에서 제거
    //       </a>
    //     )
    //   } else {
    //     return (
    //       <a style={{ cursor: 'pointer' }} onClick={this._handleOnClickAddToWishList}>
    //         <i className='fa fa-heart-o pr-10' /> 위시리스트에 담기
    //       </a>
    //     )
    //   }
    // }
    const renderWishListButton = () => {
      if (cartList && cartList.filter(cart => {
        if (type === 'lesson') return cart.lessonId === item.id && cart.type === '위시리스트'
        else return cart.productId === item.id && cart.type === '위시리스트'
      }).length > 0) {
        return (
          <Button className='pull-right' animated color='white' style={{ margin: '0px' }}
            onClick={this._handleOnClickRemoveFromWishList} size='sm'
            textComponent={<span>위시리스트에서 제거 <i className='fa fa-times' /></span>}
          />
        )
      } else {
        return (
          <Button className='pull-right' animated color='white' style={{ margin: '0px' }}
            onClick={this._handleOnClickAddToWishList} size='sm'
            textComponent={<span>위시리스트에 담기 <i className='fa fa-heart-o' /></span>}
          />
        )
      }
    }
    return (
      <div className='col-md-4 masonry-grid-item'>
        <div className='listing-item white-bg bordered mb-20'>
          <div className='overlay-container'>
            <img src={item.titleImg} />
            <Link to={`/item/${this.props.type}/${item.id}`} className='overlay-link'>
              <i className='fa fa-search-plus' />
            </Link>
            {renderDiscountBadge()}
            {/* <div className='overlay-to-top links'>
              <span className='small'>
                {renderWishListButton()}
              </span>
            </div> */}
          </div>
          <div className='body'>
            {renderCategory()}
            <h3>
              {item.title} <span className='default-bg badge'>{item.location}</span>
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
  cartList: React.PropTypes.array
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)
