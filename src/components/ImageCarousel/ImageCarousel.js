import React, { PropTypes } from 'react'
import keygen from 'keygenerator'

class ImageCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      images: this.props.images
    }
    this._handleOnClickThumbnail = this._handleOnClickThumbnail.bind(this)
    this._initMagnificPopup = this._initMagnificPopup.bind(this)
  }
  componentDidMount () {
    setTimeout(() => this._initMagnificPopup(), 100)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevState.index !== this.state.index) {
      this._initMagnificPopup()
    }
  }
  _initMagnificPopup () {
    window.$('.popup-img').magnificPopup({
      type:'image',
      gallery: {
        enabled: true
      }
    })
  }
  _handleOnClickThumbnail (e) {
    this.setState({
      index: e.target.dataset.index
    })
  }
  render () {
    const renderThumbnails = () => {
      let seq = 0
      return this.props.images.map(image => {
        return (
          <div key={keygen._()} className='col-xs-3' onClick={this._handleOnClickThumbnail} data-index={seq}
            style={{ paddingLeft: seq === 0 ? '0px' : (seq === 1 ? '2.5px' : (seq === 2 ? '5px' : '7.5px')), paddingRight: seq === 3 ? '0px' : (seq === 2 ? '2.5px' : (seq === 1 ? '5px' : '7.5px')), cursor: 'pointer' }}>
            <img src={image} data-index={seq++} />
          </div>
        )
      })
    }
    const renderImages = () => {
      return this.props.images.map(image => {
        return (
          <div key={keygen._()} style={{ display: this.state.images[this.state.index] === image ? 'block' : 'none' }}>
            <img src={image} />
            <a href={image} style={{ cursor: 'pointer' }} className='popup-img overlay-link' title=''><i className='icon-plus-1' /></a>
          </div>
        )
      })
    }
    return (
      <div>
        <div className='overlay-container overlay-visible'>
          {renderImages()}
        </div>
        <div className='row' style={{ marginTop: '10px', marginRight: '0px', marginLeft: '0px' }}>
          {renderThumbnails()}
        </div>
      </div>
    )
  }
}

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired
}

export default ImageCarousel
