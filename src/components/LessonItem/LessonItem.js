import React from 'react'
import { Link } from 'react-router'
import { getDiscountPercentage, convertDateToString, extractDaysFromLessonDays } from 'common/util'
import numeral from 'numeral'

class LessonItem extends React.Component {
  render () {
    const lesson = this.props.lesson
    const renderPrice = () => {
      let returnComponent = null
      if (lesson.discountedPrice &&
      lesson.discountedPrice !== 0 &&
      lesson.discountedPrice !== lesson.price) {
        /* eslint-disable */
        returnComponent = (
          <span className='price'>
            <del>￦{`${numeral(lesson.price).format('0,0')}`}</del> ￦<span className='text-default'>{`${numeral(lesson.discountedPrice).format('0,0')}`}</span>
          </span>
        )
      } else {
        returnComponent = (
          <span className='price'>￦ <span className='text-default'>{`${numeral(lesson.price).format('0,0')}`}</span></span>
        )
      }
      /* eslint-enable */
      return returnComponent
    }
    const renderTag = () => {
      let returnComponent = null
      if (lesson.oneday) {
        /* eslint-disable */
        returnComponent = (
          <span>오는 <span className='text-default'>{convertDateToString(lesson.lessonDate)}</span>에 진행되는 <span className='text-default'>원데이레슨</span></span>
        )
      } else {
        returnComponent = (
          <span>
            오는 <span className='text-default'>{convertDateToString(lesson.lessonDate)}</span>부터 <span className='text-default'>{`${lesson.weekType} ${extractDaysFromLessonDays(lesson.lessonDays)}요일`}</span>에 <span className='text-default'>{lesson.weekLong}주간</span> 진행
          </span>
        )
        /* eslint-enable */
      }
      return returnComponent
    }
    const renderDiscountBadge = () => {
      if (lesson.discountedPrice &&
      lesson.discountedPrice !== 0 &&
      lesson.discountedPrice !== lesson.price) {
        return (
          <span className='badge'>
            {
              `${getDiscountPercentage(lesson.price, lesson.discountedPrice)}% OFF`
            }
          </span>
        )
      }
    }
    return (
      <div className='col-md-4 masonry-grid-item'>
        <div className='listing-item white-bg bordered mb-20'>
          <div className='overlay-container'>
            <img src={lesson.titleImg} />
            <Link to={`/item/lesson/${lesson.id}`} className='overlay-link'>
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
            <h3>
              {lesson.title} <span className='default-bg badge'>{lesson.location}</span>
            </h3>
            <p>
              {lesson.detail}
            </p>
            <p className='small'>
              {renderTag()}
            </p>
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

LessonItem.propTypes = {
  lesson : React.PropTypes.object.isRequired
}

export default LessonItem
