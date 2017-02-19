import React, { PropTypes } from 'react'
import keygen from 'keygenerator'
import { setInlineScripts } from 'common/util'

class ImageCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      images: this.props.images
    }
    this._handleOnClickThumbnail = this._handleOnClickThumbnail.bind(this)
  }
  componentDidMount () {
    const scripts = ['/template/plugins/magnific-popup/jquery.magnific-popup.min.js',
      '/template/js/inline-image-carousel.js']
    setInlineScripts(scripts)
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
            style={{ paddingLeft: seq === 0 ? '15px' : '5px', paddingRight: seq === 3 ? '15px' : '5px', cursor: 'pointer' }}>
            <img src={image} data-index={seq++} />
          </div>
        )
      })
    }
    const image = this.state.images[this.state.index]
    return (
      <div>
        <div className='overlay-container overlay-visible'>
          <img src={image} />
          <a href={image} className='popup-img overlay-link' title=''><i className='icon-plus-1' /></a>
        </div>
        <div className='row' style={{ marginTop: '10px' }}>
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
