import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import Navigation from 'components/Navigation'
import ItemList from 'components/ItemList'
import ActionBlock from 'components/ActionBlock'

class ItemListView extends React.Component {
  constructor (props) {
    super(props)
    this._loadItems = this._loadItems.bind(this)
    this._clearItems = this._clearItems.bind(this)
  }
  componentDidMount () {
    this._loadItems()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.type !== this.props.params.type) {
      this._clearItems()
      this._loadItems()
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
  render () {
    const { type } = this.props.params
    const items = type === 'lesson' ? this.props.lessonList : this.props.productList
    const renderTitle = () => {
      let returnComponent = null
      if (type === 'lesson') {
        returnComponent = <span>플라워레슨</span>
      } else if (type === 'flower') {
        returnComponent = <span>꽃다발</span>
      } else if (type === 'wedding') {
        returnComponent = <span>웨딩</span>
      }
      return returnComponent
    }
    const renderDescription = () => {
      let returnComponent = null
      if (type === 'lesson') {
        returnComponent = <span>hada만의 고품격 레슨으로 유러피언 스타일의 작품들을 직접 만들어보세요.</span>
      } else if (type === 'flower') {
        returnComponent = <span>hada의 꽃다발들은 주문과 동시에 만들어지기 때문에 언제나 싱싱합니다.</span>
      } else if (type === 'wedding') {
        returnComponent = <span>hada가 준비한 웨딩 아이템들로 당신의 결혼식을 빛내보세요.</span>
      }
      return returnComponent
    }
    const setTabTitles = () => {
      if (type === 'lesson') {
        return ['전체', '원데이레슨', '취미반', '창업반']
      } else if (type === 'flower') {
        return ['전체', '단체꽃다발', '이벤트꽃다발']
      }
    }
    const setTabIcons = () => {
      if (type === 'lesson') {
        return ['fa fa-list', 'fa fa-check', 'fa fa-heart', 'fa fa-graduation-cap']
      } else if (type === 'flower') {
        return ['fa fa-list', 'fa fa-users', 'fa fa-gift']
      }
    }
    const setTabLinks = () => {
      if (type === 'lesson') {
        return ['/item-list/lesson/all', '/item-list/lesson/원데이레슨',
          '/item-list/lesson/취미반', '/item-list/lesson/창업반']
      } else if (type === 'flower') {
        return ['/item-list/flower/all', '/item-list/flower/단체꽃다발', '/item-list/flower/이벤트꽃다발']
      }
    }
    const filterItems = () => {
      const { type, filter } = this.props.params
      return items.filter(item => {
        if (!item.activated) return false
        else if (type === 'lesson') {
          if (filter === 'all') return true
          return item.mainCategory === filter
        } else {
          if (filter === 'all') return true
          return item.subCategory === filter
        }
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
      if (type === 'lesson' || type === 'flower') {
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
              <div className='main col-md-12'>
                {renderNavigation()}
                {
                  items &&
                  <ItemList
                    items={filterItems()}
                    itemType={type === 'lesson' ? 'lesson' : 'product'}
                  />
                }
              </div>
            </div>
          </div>
        </section>
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
