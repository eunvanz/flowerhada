import React from 'react'
import ProductItem from '../ProductItem'

class ItemList extends React.Component {
  componentDidMount () {
    window.scrollTo(0, 0)
  }
  render () {
    const renderItems = () => {
      const returnComponent = []
      const items = this.props.items
      for (const item of items) {
        returnComponent
        .push(<ProductItem key={item.id} item={item} type={this.props.itemType} />)
      }
      if (returnComponent.length === 0) {
        return <div className='text-center'
          style={{ height: '100px', top: '50px', position: 'relative' }}>현재 판매중인 상품이 없습니다.</div>
      }
      return returnComponent
    }
    return (
      <div className='row masonry-grid-fitrows grid-space-10'>
        {renderItems()}
      </div>
    )
  }
}

ItemList.propTypes = {
  items: React.PropTypes.array.isRequired,
  itemType: React.PropTypes.string.isRequired
}

export default ItemList
