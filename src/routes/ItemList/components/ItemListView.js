import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import Navigation from 'components/Navigation'
import ItemList from 'components/ItemList'
import LessonRequestActionBlock from 'components/LessonRequestActionBlock'
import Loading from 'components/Loading'
import { sortLessonsByLessonDayDesc } from 'common/util'

class ItemListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
    this._loadItems = this._loadItems.bind(this)
    this._clearItems = this._clearItems.bind(this)
    this._applyMasonry = this._applyMasonry.bind(this)
    this._filter = this._filter.bind(this)
    this._initMasonry = this._initMasonry.bind(this)
  }
  componentDidMount () {
    this._loadItems()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.type !== this.props.params.type) {
      this._clearItems()
      this._loadItems()
    } else if (prevProps.params.filter !== this.props.params.filter) {
      this._filter(this.props.params.filter)
    }
  }
  componentWillUnmount () {
    this._clearItems()
  }
  _clearItems () {
    this.props.clearLessons()
    this.props.clearProducts()
  }
  _loadItems () {
    const { type } = this.props.params
    if (type === 'lesson') {
      this.props.fetchLessons()
    } else if (type === 'flower') {
      this.props.fetchProductsByMainCategory('꽃다발')
    } else if (type === 'wedding') {
      this.props.fetchProductsByMainCategory('웨딩')
    } else {
      this.context.router.push('/not-found')
    }
  }
  _initMasonry () {
    this._applyMasonry()
    this._filter(this.props.params.filter)
  }
  _applyMasonry () {
    const $ = window.$
    const msnryGrid = $('.masonry-grid').imagesLoaded(() => {
      this.setState({ isLoading: false })
      msnryGrid.isotope({
        itemSelector: '.masonry-grid-item',
        layoutMode: 'masonry'
      })
    })
  }
  _filter (filter) {
    const $ = window.$
    if (filter === 'all') filter = '*'
    else filter = `.${filter}`
    $('.masonry-grid').isotope({ filter })
  }
  render () {
    const { type } = this.props.params
    const items = type === 'lesson' ? sortLessonsByLessonDayDesc(this.props.lessonList) : this.props.productList
    const renderTitle = () => {
      let returnComponent = null
      if (type === 'lesson') {
        returnComponent = <span>플라워레슨</span>
      } else if (type === 'flower') {
        returnComponent = <span>꽃다발</span>
      } else if (type === 'wedding') {
        returnComponent = <span>웨딩 & 파티</span>
      }
      return returnComponent
    }
    const renderDescription = () => {
      let returnComponent = null
      if (type === 'lesson') {
        returnComponent = <span>프렌치 감성의 작품들을 직접 만들어보세요. 출장레슨 신청은 언제나 환영입니다.</span>
      } else if (type === 'flower') {
        returnComponent = <span>꽃하다는 꽃다발 주문 이후 꽃시장에서 장을 보기 때문에, 가장 신선한 상태의 꽃다발을 받아보실 수 있습니다.</span>
      } else if (type === 'wedding') {
        returnComponent = <span>꽃하다가 제안하는 웨딩 & 파티 솔루션으로 더욱 반짝이는 추억을 만들어 보세요.</span>
      }
      return returnComponent
    }
    const setTabTitles = () => {
      if (type === 'lesson') {
        return ['전체', '원데이레슨', '취미반', '창업반', '웨딩반']
      } else if (type === 'flower') {
        return ['전체', '단체꽃다발', '이벤트꽃다발']
      } else if (type === 'wedding') {
        return ['전체', '부케', '소품']
      }
    }
    const setTabIcons = () => {
      if (type === 'lesson') {
        return ['fa fa-list', 'fa fa-scissors', 'fa fa-heart', 'fa fa-graduation-cap', 'fa fa-diamond']
      } else if (type === 'flower') {
        return ['fa fa-list', 'fa fa-users', 'fa fa-gift']
      } else if (type === 'wedding') {
        return ['fa fa-list', 'fa fa-asterisk', 'fa fa-birthday-cake']
      }
    }
    const setTabLinks = () => {
      if (type === 'lesson') {
        return ['/item-list/lesson/all', '/item-list/lesson/원데이레슨',
          '/item-list/lesson/취미반', '/item-list/lesson/창업반', '/item-list/lesson/웨딩반']
      } else if (type === 'flower') {
        return ['/item-list/flower/all', '/item-list/flower/단체꽃다발', '/item-list/flower/이벤트꽃다발']
      } else if (type === 'wedding') {
        return ['/item-list/wedding/all', '/item-list/wedding/부케', '/item-list/wedding/소품']
      }
    }
    const filterItems = () => {
      // const { type, filter } = this.props.params
      return items.filter(item => {
        if (!item.activated) return false
        else return true
        // else if (type === 'lesson') {
        //   if (filter === 'all') return true
        //   return item.mainCategory === filter
        // } else {
        //   if (filter === 'all') return true
        //   return item.subCategory === filter
        // }
      })
    }
    const renderBackgroundImage = () => {
      if (type === 'lesson') {
        return 'http://cfile4.uf.tistory.com/image/271895495756A3052D00B3'
      } else if (type === 'flower') {
        return 'https://s-media-cache-ak0.pinimg.com/originals/78/06/a5/7806a591a1261df473620b97f612f8f0.jpg'
      } else if (type === 'wedding') {
        return 'http://822420fb08c1898dea0e-c9228deb93c56b2bac4bc2862bfae73e.r6.cf1.rackcdn.com/lps/assets/u/fpt-112704-Wedding-Flowers.jpg' // eslint-disable-line
      }
    }
    const renderNavigation = () => {
      if (type === 'lesson' || type === 'flower' || type === 'wedding') {
        return (
          <Navigation
            tabTitles={setTabTitles()}
            tabIcons={setTabIcons()}
            tabLinks={setTabLinks()}
          />
        )
      }
    }
    return (
      <div>
        <Parallax title={renderTitle()} description={renderDescription()}
          backgroundImage={renderBackgroundImage()} />
        <section className='main-container'>
          <div className='container'>
            <div className='row'>
              {
                this.state.isLoading &&
                <Loading text='상품을 불러오는 중...' style={{ height: '200px' }} />
              }
              <div className='main col-md-12' style={{ display: this.state.isLoading ? 'none' : 'block' }}>
                {renderNavigation()}
                {
                  items &&
                  <ItemList
                    items={filterItems()}
                    itemType={type === 'lesson' ? 'lesson' : 'product'}
                    onLoad={this._initMasonry}
                  />
                }
              </div>
            </div>
          </div>
        </section>
        { type === 'lesson' &&
          <LessonRequestActionBlock />
        }
      </div>
    )
  }
}

ItemListView.contextType = {
  router: PropTypes.object
}

ItemListView.propTypes = {
  lessonList: PropTypes.array,
  productList: PropTypes.array,
  params: PropTypes.object.isRequired,
  fetchLessons: PropTypes.func.isRequired,
  fetchLessonsByMainCategory: PropTypes.func.isRequired,
  fetchProductsByMainCategory: PropTypes.func.isRequired,
  fetchProductsBySubCategory: PropTypes.func.isRequired,
  clearLessons: PropTypes.func.isRequired,
  clearProducts: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default ItemListView
