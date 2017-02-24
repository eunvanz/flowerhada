import React, { PropTypes } from 'react'
import RecentItem from 'components/RecentItem'
import keygen from 'keygenerator'
import Button from 'components/Button'
// import $ from 'jquery'
// import 'template/plugins/owl-carousel/owl.carousel.min'
// import Slider from 'react-slick'
import $ from 'jquery'

class WishList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curPage: 1,
      perPage: 3
    }
    this._onClickNextButton = this._onClickNextButton.bind(this)
    this._onClickPrevButton = this._onClickPrevButton.bind(this)
  }
  componentDidMount () {
    // $('#wishList').owlCarousel({
    //   singleItem: true,
    //   navigation: true,
    //   pagination: true,
    //   autoPlay: false
    // })
  }
  _onClickPrevButton () {
    $('#wishListBtn').click()
    let page = this.state.curPage - 1
    if (page < 1) page = Math.ceil(this.props.items.length / this.state.perPage)
    this.setState({ curPage: page })
  }
  _onClickNextButton () {
    $('#wishListBtn').click()
    let page = this.state.curPage + 1
    if (page > Math.ceil(this.props.items.length / this.state.perPage)) page = 1
    this.setState({ curPage: page })
  }
  render () {
    const { items } = this.props
    const { curPage, perPage } = this.state
    const currentItems = items.slice((curPage - 1) * perPage, (curPage - 1) * perPage + perPage)
    const renderWishList = () => {
      return currentItems.map(item => {
        item.product ? item.product.type = 'product' : item.lesson.type = 'lesson'
        return <RecentItem key={keygen._()} item={item.product || item.lesson} />
      })
    }
    return (
      <ul className='dropdown-menu dropdown-menu-right dropdown-animation'>
        <li>
          {
            items &&
            <div id='wishList' style={{ width: '250px' }}>
              {renderWishList()}
            </div>
          }
          {
            (!items || items.length === 0) &&
            <div className='text-center'><i className='fa fa-exclamation-circle' /> 위시리스트가 비어있습니다.</div>
          }
        </li>
        { items && items.length > this.state.perPage &&
          <div className='row'>
            <div className='col-xs-4'>
              <Button size='sm' color='dark-bordered' onClick={this._onClickPrevButton}
                textComponent={<span><i className='fa fa-chevron-left pr-10' /> 이전</span>} />
            </div>
            <div className='col-xs-4 text-center' style={{ paddingTop: '10px' }}>
              <small>{this.state.curPage}/{Math.ceil(items.length / this.state.perPage)}</small>
            </div>
            <div className='col-xs-4 text-right'>
              <Button size='sm' color='dark-bordered' className='pull-right' onClick={this._onClickNextButton}
                textComponent={<span>다음 <i className='fa fa-chevron-right pr-10'
                  style={{ paddingLeft: '10px', paddingRight: '0px' }} /></span>} />
            </div>
          </div>
        }
      </ul>
    )
  }
}

WishList.propTypes = {
  items: PropTypes.array
}

export default WishList
