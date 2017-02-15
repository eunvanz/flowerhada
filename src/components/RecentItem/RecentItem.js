import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import numeral from 'numeral'

class RecentItem extends React.Component {
  render () {
    const { item } = this.props
    return (
      <div className='media margin-clear'>
        <div className='media-left'>
          <div className='overlay-container'>
            <img className='media-object' src={item.titleImg} style={{ maxWidth: '100px', cursor: 'pointer' }} />
            <Link to={`/item/${item.type}/${item.id}`}
              className='overlay-link small'><i className='fa fa-link' /></Link>
          </div>
        </div>
        <div className='media-body'>
          <h5 className='media-heading' style={{ cursor: 'pointer' }}>
            <Link to={`/item/${item.type}/${item.id}`}>{item.title}</Link>
          </h5>
          <p className='margin-clear'>
            <small>{item.type === 'lesson' ? '플라워레슨 > ' : '꽃다발 > '}{item.mainCategory}</small>
          </p>
          <p className='price'>￦{numeral(item.price).format('0,0')}</p>
        </div>
      </div>
    )
  }
}

RecentItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default RecentItem
