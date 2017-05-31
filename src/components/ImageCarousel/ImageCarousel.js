import React, { PropTypes } from 'react'
import keygen from 'keygenerator'
import { setInlineScripts, clearInlineScripts } from 'common/util'
// import $ from 'jquery'
// import 'template/plugins/magnific-popup/jquery.magnific-popup.min.js'
// import Slider from 'react-slick'
// TODO react-slick 적용

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
      // '/template/plugins/owl-carousel/owl.carousel.min.js']
    // $('.popup-img').magnificPopup({
    //   type:'image',
    //   gallery: {
    //     enabled: true
    //   }
    // })
    setInlineScripts(scripts)
  //   window.$('.owl-carousel.carousel').owlCarousel({
  //     items: 4,
  //     pagination: false,
  //     navigation: true,
  //     navigationText: false,
  //     autoHeight: true
  //   })
  //   const sync1 = window.$('.owl-carousel.content-slider-with-thumbs')
  //   const sync2 = window.$('.owl-carousel.content-slider-thumbs')
  //
  //   sync1.owlCarousel({
  //     singleItem : true,
  //     slideSpeed : 1000,
  //     navigation: true,
  //     pagination:false,
  //     afterAction : syncPosition,
  //     responsiveRefreshRate : 200
  //   })
  //
  //   sync2.owlCarousel({
  //     items : 4,
  //     itemsDesktop : [1199, 4],
  //     itemsDesktopSmall : [979, 4],
  //     itemsTablet : [768, 4],
  //     itemsMobile : [479, 4],
  //     pagination: false,
  //     responsiveRefreshRate : 100,
  //     afterInit : function (el) {
  //       el.find('.owl-item').eq(0).addClass('synced')
  //     }
  //   })
  //
  //   function syncPosition (el) {
  //     var current = this.currentItem
  //     window.$('.owl-carousel.content-slider-thumbs')
  //     .find('.owl-item')
  //     .removeClass('synced')
  //     .eq(current)
  //     .addClass('synced')
  //     if (window.$('.owl-carousel.content-slider-thumbs').data('owlCarousel') !== undefined) {
  //       center(current)
  //     }
  //   }
  //
  //   window.$('.owl-carousel.content-slider-thumbs').on('click', '.owl-item', function (e) {
  //     e.preventDefault()
  //     var number = window.$(this).data('owlItem')
  //     sync1.trigger('owl.goTo', number)
  //   })
  //
  //   function center (number) {
  //     var sync2visible = sync2.data('owlCarousel').owl.visibleItems
  //     var num = number
  //     var found = false
  //     for (var i in sync2visible) {
  //       if (num === sync2visible[i]) {
  //         found = true
  //       }
  //     }
  //
  //     if (found === false) {
  //       if (num > sync2visible[sync2visible.length - 1]) {
  //         sync2.trigger('owl.goTo', num - sync2visible.length + 2)
  //       } else {
  //         if (num - 1 === -1) {
  //           num = 0
  //         }
  //         sync2.trigger('owl.goTo', num)
  //       }
  //     } else if (num === sync2visible[sync2visible.length - 1]) {
  //       sync2.trigger('owl.goTo', sync2visible[1])
  //     } else if (num === sync2visible[0]) {
  //       sync2.trigger('owl.goTo', num - 1)
  //     }
  //   }
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevState.index !== this.state.index) {
      const scripts = ['/template/js/inline-image-carousel.js']
      setInlineScripts(scripts)
    }
  }
  componentWillUnmount () {
    clearInlineScripts()
  }
  _handleOnClickThumbnail (e) {
    this.setState({
      index: e.target.dataset.index
    })
  }
  render () {
    // const settings = {
    //   customPaging: function (i) {
    //     return <a><img src={this.props.images[i]} /></a>
    //   },
    //   dots: true,
    //   dotsClass: 'slick-dots slick-thumb',
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1
    // }
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
    // const renderThumbnails = () => {
    //   return this.props.images.map(image => {
    //     return (
    //       <div key={keygen._()} className='owl-nav-thumb'>
    //         <img src={image} alt='' />
    //       </div>
    //     )
    //   })
    // }
    const renderImages = () => {
      return this.props.images.map(image => {
        return (
          <div key={keygen._()} style={{ display: this.state.images[this.state.index] === image ? 'block' : 'none' }}>
            <img src={image} />
            <a href={image} className='popup-img overlay-link' title=''><i className='icon-plus-1' /></a>
          </div>
        )
      })
    }
    // const renderImages = () => {
    //   return this.props.images.map(image => {
    //     return (
    //       <div key={keygen._()} className='overlay-container overlay-visible'>
    //         <img src={image} />
    //         <a href={image} className='popup-img overlay-link' title=''><i className='icon-plus-1' /></a>
    //       </div>
    //     )
    //   })
    // }
    // const renderImages = () => {
    //   return this.props.images.map(image => {
    //     return (
    //       <div key={keygen._()}>
    //         <img src={image} />
    //         <a href={image} className='popup-img overlay-link' title=''><i className='icon-plus-1' /></a>
    //       </div>
    //     )
    //   })
    // }
    return (
      <div>
        {/* <Slider {...settings}>
          {renderImages()}
        </Slider> */}
        {/* <div className='owl-carousel content-slider-with-thumbs mb-20'> */}
        <div className='overlay-container overlay-visible'>
          {renderImages()}
        </div>
        {/* </div> */}
        {/* <div className='content-slider-thumbs-container'>
          <div className='owl-carousel content-slider-thumbs'>
            {renderThumbnails()}
          </div>
        </div> */}
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
