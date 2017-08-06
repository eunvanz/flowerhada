import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import { getAllProducts } from 'common/ProductService'
import { getAllLessons } from 'common/LessonService'
import _ from 'lodash'
import ItemList from 'components/ItemList'

class GalleryView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: null,
      isLightboxOpen: false
    }
    this._initMasonry = this._initMasonry.bind(this)
    this._applyMasonry = this._applyMasonry.bind(this)
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
      items = _.orderBy(items, condition, order)
      this.setState({ items })
      this._initMasonry()
    })
  }
  _initMasonry () {
    this._applyMasonry()
  }
  _applyMasonry () {
    const $ = window.$
    const msnryGrid = $('.masonry-grid').imagesLoaded(() => {
      msnryGrid.masonry({
        itemSelector: '.masonry-grid-item'
      })
    })
  }
  render () {
    const { items } = this.state
    return (
      <div>
        <Parallax title={<span>'꽃하다 갤러리'</span>} description={<span>'꽃하다의 모든 상품 이미지들이 모여있는 꽃하다 갤러리입니다.'</span>}
          backgroundImage={'http://i.imgur.com/vEU5rNa.jpg'} />
        <section className='main-container'>
          <div className='container'>
            <div className='row'>
              <div className='main col-md-12'>
                { items &&
                  <ItemList
                    items={items}
                    itemType={'gallery'}
                    onLoad={this._initMasonry}
                  />
                }
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
