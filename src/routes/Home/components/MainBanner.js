import React from 'react'
import { Link } from 'react-router'

class MainBanner extends React.Component {
  render () {
    const renderElements = () => {
      const resultComponent = []
      for (const mainBanner of this.props.mainBanners) {
        resultComponent.push(
          <li data-transition='random' data-slotamount='7'
            data-masterspeed='500' data-saveperformance='on'
            data-title={mainBanner.shortTitle} key={mainBanner.id}>
            <img src={mainBanner.img}
              data-bgposition='center top' alt='메인배너'
              data-bgrepeat='no-repeat' data-bgfit='cover' />
            <div
              className='tp-caption dark-translucent-bg'
              data-x='center'
              data-y='bottom'
              data-speed='600'
              data-start='0'
            />
            <div className='tp-caption sfb fadeout large_white'
              data-x='left'
              data-y='180'
              data-speed='500'
              data-start='1000'
              data-easing='easeOutQuad'
              dangerouslySetInnerHTML={{ __html: mainBanner.title }}
            />
            <div className='tp-caption sfb fadeout large_white tp-resizeme hidden-xs'
              data-x='left'
              data-y='300'
              data-speed='500'
              data-start='1300'
              data-easing='easeOutQuad'>
              <div className='separator-2 light' />
            </div>
            <div className='tp-caption sfb fadeout medium_white hidden-xs'
              data-x='left'
              data-y='320'
              data-speed='500'
              data-start='1300'
              data-easing='easeOutQuad'
              data-endspeed='600'
              dangerouslySetInnerHTML={{ __html: mainBanner.detail }}
            />
            <div className='tp-caption sfb fadeout small_white text-center'
              data-x='left'
              data-y='400'
              data-speed='500'
              data-start='1600'
              data-easing='easeOutQuad'
              data-endspeed='600'
            >
              <Link to={mainBanner.link} className='btn btn-default btn-animated'>
                자세히보기 <i className='fa fa-arrow-right' />
              </Link>
            </div>
          </li>
        )
      }
      return resultComponent
    }
    return (
      <div className='banner clearfix'>
        <div className='slideshow'>
          <div className='slider-banner-container'>
            <div className='slider-banner-fullwidth-big-height' id='main-banner'>
              <ul className='slides'>
                {renderElements()}
              </ul>
              <div className='tp-bannertimer' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

MainBanner.propTypes = {
  mainBanners: React.PropTypes.array.isRequired
}

export default MainBanner
