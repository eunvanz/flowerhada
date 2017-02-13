import React from 'react'
import LessonItem from '../LessonItem'

class ItemList extends React.Component {
  render () {
    const renderItems = () => {
      const returnComponent = []
      if (this.props.itemType === 'lesson') {
        const lessons = this.props.items
        for (const lesson of lessons) {
          returnComponent.push(<LessonItem key={lesson.id} lesson={lesson} />)
        }
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
