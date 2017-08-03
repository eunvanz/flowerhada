import React from 'react'
import ProductItem from '../ProductItem'
import keygen from 'keygenerator'
import GalleryItem from '../GalleryItem'
import { getImageUrlsFromContent } from 'common/util'
import _ from 'lodash'

class ItemList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loadedItems: 0,
      fullLoaded: false
    }
    this._handleOnLoadItem = this._handleOnLoadItem.bind(this)
  }
  componentDidMount () {
    window.scrollTo(0, 0)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.onLoad && this.state.loadedItems + 1 === this.props.items.length) {
      this.props.onLoad()
    }
  }
  _handleOnLoadItem () {
    this.setState({ loadedItems: this.state.loadedItems + 1 })
    if (this.state.loadedItems + 1 === this.props.items.length) {
      this.setState({ fullLoaded: true })
    }
  }
  render () {
    const renderItems = () => {
      const returnComponent = []
      const { items, itemType } = this.props
      if (itemType === 'gallery') {
        for (const item of items) {
          returnComponent
          .push(<GalleryItem key={keygen._()} item={item} src={item.titleImg} />)
          if (item.images) {
            let images = JSON.parse(item.images)
            images = _.drop(images)
            for (const image of images) {
              returnComponent.push(<GalleryItem key={keygen._()} item={item} src={image} />)
            }
          }
          const contentImages = getImageUrlsFromContent(item.content)
          for (const image of contentImages) {
            returnComponent.push(<GalleryItem key={keygen._()} item={item} src={image} />)
          }
        }
      } else {
        for (const item of items) {
          returnComponent
          .push(<ProductItem key={item.id} item={item} type={this.props.itemType} onLoad={this._handleOnLoadItem} />)
        }
        if (returnComponent.length === 0) {
          return <div className='text-center'
            style={{ height: '100px', top: '50px', position: 'relative' }}><i className='fa fa-exclamation-triangle' /> 현재 판매중인 상품이 없습니다.</div>
          }
      }
      return returnComponent
    }
    return (
      <div className='row masonry-grid grid-space-10'>
        {renderItems()}
      </div>
    )
  }
}

ItemList.propTypes = {
  items: React.PropTypes.array.isRequired,
  itemType: React.PropTypes.string.isRequired,
  onLoad: React.PropTypes.func
}

export default ItemList
