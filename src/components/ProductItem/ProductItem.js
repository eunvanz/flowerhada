import React from 'react'
import { Link } from 'react-router'
import { getDiscountPercentage, convertDateToString, extractDaysFromLessonDays } from 'common/util'
import numeral from 'numeral'

class ProductItem extends React.Component {
  render () {
    const item = this.props.item
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
      if (this.props.type === 'flower') {
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
    const renderDateInfo = () => {
      let returnComponent = null
      if (item.oneday) {
        /* eslint-disable */
        returnComponent = (
          <span>오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>에 진행되는 <span className='text-default'>원데이레슨</span></span>
        )
      } else {
        returnComponent = (
          <span>
            오는 <span className='text-default'>{convertDateToString(item.lessonDate)}</span>부터 <span className='text-default'>{`${item.weekType} ${extractDaysFromLessonDays(item.lessonDays)}요일`}</span>에 <span className='text-default'>{item.weekLong}주간</span> 진행
          </span>
        )
        /* eslint-enable */
      }
      return returnComponent
    }
    const renderTag = () => {
      if (this.props.type === 'lesson') {
        return (
          <p className='small'>
            {renderDateInfo()}
          </p>
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
            <div className='overlay-to-top links'>
              <span className='small'>
                <Link to='/'>
                  <i className='fa fa-heart-o pr-10' /> 위시리스트에 담기
                </Link>
              </span>
            </div>
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
              <button className='pull-right margin-clear btn btn-sm btn-default-transparent btn-animated'>
                장바구니에 담기 <i className='fa fa-shopping-cart' />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProductItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired
}

export default ProductItem
