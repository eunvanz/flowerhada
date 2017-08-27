import React, { PropTypes } from 'react'

class GalleryItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    this._initMagnificPopup = this._initMagnificPopup.bind(this)
  }
  componentDidMount () {
    setTimeout(() => {
      this._initMagnificPopup()
    }, 100)
    // window.goToItem = e => {
    //   console.log(e)
    //   const { type, id } = e.target.dataset
    //   this.context.router.push(`/${type}/${id}`)
    // }
  }
  _initMagnificPopup () {
    window.$('.popup-img').magnificPopup({
      type:'image',
      gallery: {
        enabled: true
      }
    })
  }
  render () {
    const { src, item } = this.props
    return (
      <div className={`col-md-4 col-xs-6 masonry-grid-item`}>
        <div className='listing-item white-bg bordered mb-10'>
          <div className='overlay-container'>
            <img src={src} />
            <a href={src} style={{ cursor: 'pointer' }}
              className='popup-img overlay-link'
              title={`${item.title} <a class='item-link' href='/item/${item.lessonDate ? 'lesson' : 'product'}/${item.id}' style='cursor: pointer; margin-left: 10px;' data-type=${`${item.lessonDate ? 'lesson' : 'product'}`} data-id=${`${item.id}`}>상품바로가기</a>`}><i className='icon-plus-1' /></a>
          </div>
        </div>
      </div>
    )
  }
}

GalleryItem.contextTypes = {
  router: PropTypes.object.isRequired
}

GalleryItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  src: React.PropTypes.string.isRequired,
  onLoad: React.PropTypes.func
}

export default GalleryItem
