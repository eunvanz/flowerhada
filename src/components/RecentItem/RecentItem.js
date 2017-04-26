import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import numeral from 'numeral'
import Loading from 'components/Loading'

class RecentItem extends React.Component {
  render () {
    const { item } = this.props
    if (item) {
      return (
        <div className='media' style={{ marginBottom: '10px' }}>
          <div className='media-left'>
            <div className='overlay-container'>
              <img className='media-object' src={item.titleImg} style={{ maxWidth: '100px', cursor: 'pointer' }} />
              <Link to={`/item/${item.type}/${item.id}`}
                className='overlay-link small'><i className='fa fa-link' /></Link>
            </div>
          </div>
          <div className='media-body'>
            <h5 className='media-heading' style={{ cursor: 'pointer' }}>
              <Link to={`/item/${item.type}/${item.id}`} className='text-default'>{item.title}</Link>
            </h5>
            <p className='margin-clear'>
              <small>
                {item.type === 'lesson' ? '플라워레슨' : item.mainCategory} <i className='fa fa-angle-right' /> {item.type === 'lesson' ? item.mainCategory : item.subCategory}
              </small>
            </p>
            <p className='price' style={{ marginBottom: '0px' }}>￦{numeral(item.price).format('0,0')}</p>
          </div>
        </div>
      )
    } else {
      return <Loading text='로드중..' />
    }
  }
}

RecentItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default RecentItem
