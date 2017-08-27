import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import { getAllProducts } from 'common/ProductService'
import { getAllLessons } from 'common/LessonService'
import _ from 'lodash'
import ItemList from 'components/ItemList'
// import Waypoint from 'react-waypoint'
import Loading from 'components/Loading'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import GalleryItem from 'components/GalleryItem'
import keygen from 'keygenerator'
import { getImageUrlsFromContent } from 'common/util'

class GalleryView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: null,
      allItems: null,
      isLightboxOpen: false,
      currentPage: 1,
      perPage: 2,
      isLoading: true,
      totalPage: 0
    }
    this._initMasonry = this._initMasonry.bind(this)
    this._applyMasonry = this._applyMasonry.bind(this)
    // this._handleOnFullLoad = this._handleOnFullLoad.bind(this)
    // this._handleOnLoadMore = this._handleOnLoadMore.bind(this)
  }
  componentDidMount () {
    let items = []
    getAllProducts()
    .then(res => {
      const products = res.data
      items = products
      return getAllLessons()
    })
    .then(res => {
      const lessons = res.data
      items = _.concat(items, lessons)
      const condition = [
        (e) => e.regDateTime ? e.regDateTime.year : 0,
        (e) => e.regDateTime ? e.regDateTime.dayOfYear : 0,
        (e) => e.regDateTime ? e.regDateTime.hour : 0,
        (e) => e.regDateTime ? e.regDateTime.minute : 0,
        (e) => e.regDateTime ? e.regDateTime.second : 0,
        'id'
      ]
      const order = [
        'desc',
        'desc',
        'desc',
        'desc',
        'desc',
        'desc'
      ]
      const allItems = _.orderBy(items, condition, order)
      // this.setState({ allItems, totalPage: Math.ceil(items.length / this.state.perPage) })
      // this.setState({ items: _.slice(allItems, 0, this.state.perPage) })
      this.setState({ items: allItems })
      this._initMasonry()
    })
  }
  _initMasonry () {
    this._applyMasonry()
  }
  _applyMasonry () {
    const $ = window.$
    const msnryGrid = $('.masonry-grid').imagesLoaded(() => {
      this.setState({ isLoading: false })
      msnryGrid.masonry({
        itemSelector: '.masonry-grid-item'
      })
    })
  }
  // _loadMoreItems () {
  //   this.setState({ isLoading: true, currentPage: this.state.currentPage + 1 })
  //   this._initMasonry()
  // }
  // _handleOnFullLoad () {
  //   this._initMasonry()
  //   console.log('fullLoaded')
  //   this.setState({ isLoading: false })
  // }
  // _handleOnLoadMore () {
  //   const { currentPage, perPage, items, allItems } = this.state
  //   this.setState({
  //     currentPage: currentPage + 1,
  //     items: items.push(_.slice(allItems, perPage * currentPage, perPage * (currentPage + 1)))
  //   })
  // }
  render () {
    const { items, currentPage, perPage, isLoading, totalPage } = this.state
    // const renderGalleryItems = () => {
    //   const returnComponent = []
    //   for (const item of items) {
    //     returnComponent
    //     .push(<GalleryItem key={keygen._()} item={item} src={item.titleImg} />)
    //     if (item.images) {
    //       let images = JSON.parse(item.images)
    //       images = _.drop(images)
    //       for (const image of images) {
    //         returnComponent.push(<GalleryItem key={keygen._()} item={item} src={image} />)
    //       }
    //     }
    //     const contentImages = getImageUrlsFromContent(item.content)
    //     for (const image of contentImages) {
    //       returnComponent.push(<GalleryItem key={keygen._()} item={item} src={image} />)
    //     }
    //   }
    //   return returnComponent
    // }
    return (
      <div>
        <Parallax title={<span>꽃하다 갤러리</span>} description={<span>꽃하다의 모든 상품 이미지들이 모여있는 꽃하다 갤러리입니다.</span>}
          backgroundImage={'http://i.imgur.com/vEU5rNa.jpg'} />
        <section className='main-container'>
          <div className='container'>
            <div className='row'>
              { isLoading &&
                <Loading text='갤러리 아이템을 불러오는 중...' />
              }
              <div className='main col-md-12' style={{ display: isLoading ? 'none' : 'block' }}>
                { items &&
                  <ItemList
                    items={items}
                    itemType={'gallery'}
                  />
                }
                {/* {
                  items &&
                  <MasonryInfiniteScroller
                    hasMore={currentPage < totalPage}
                    loadMore={this._handleOnLoadMore}
                  >
                    {renderGalleryItems()}
                  </MasonryInfiniteScroller>
                } */}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

GalleryView.contextTypes = {
  router: PropTypes.object.isRequired
}

export default GalleryView
