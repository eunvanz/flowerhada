import React from 'react'
import { Link } from 'react-router'
import { imgRouteMainBanner } from 'common/constants'

class MainBanner extends React.Component {
  render () {
    return (
      <div className='banner clearfix'>
        <div className='slideshow'>
          <div className='slider-banner-container'>
            <div className='slider-banner-fullwidth-big-height' id='main-banner'>
              <ul className='slides'>
                {/* 배너 1 시작 */}
                <li data-transition='random' data-slotamount='7'
                  data-masterspeed='500' data-saveperformance='on'
                  data-title='웨딩부케 20% 할인'
                >
                  {/* main image */}
                  {/* <img src={`${imgRouteMainBanner}/AF1QipMI_BgNCwN4VEtpJzhCq2fzapiGR0WAixQp8VBy`} */}
                  <img
                    src='http://cafefiles.naver.net/20140521_63/shinfree78_1400661041690NpSUb_JPEG/Poppy-wedding-bouquet.jpg'
                    alt='웨딩부케' data-bgposition='center top'
                    data-bgrepeat='no-repeat' data-bgfit='cover'
                  />

                  {/* Transparent Background */}
                  <div // eslint-disable-line
                    className='tp-caption dark-translucent-bg'
                    data-x='center'
                    data-y='bottom'
                    data-speed='600'
                    data-start='0'
                  >
                  </div>

                  {/* LAYER NR. 1 */}
                  <div className='tp-caption sfb fadeout large_white'
                    data-x='left'
                    data-y='180'
                    data-speed='500'
                    data-start='1000'
                    data-easing='easeOutQuad'
                  >
                    웨딩부케 <span className='text-default'>20%</span> 할인<br />
                    아름다운 12월의 신부를 위해
                  </div>

                  {/* LAYER NR. 2 */}
                  <div className='tp-caption sfb fadeout large_white tp-resizeme hidden-xs'
                    data-x='left'
                    data-y='300'
                    data-speed='500'
                    data-start='1300'
                    data-easing='easeOutQuad'><div className='separator-2 light' />
                  </div>

                  {/* LAYER NR. 3 */}
                  <div className='tp-caption sfb fadeout medium_white hidden-xs'
                    data-x='left'
                    data-y='320'
                    data-speed='500'
                    data-start='1300'
                    data-easing='easeOutQuad'
                    data-endspeed='600'
                  >
                    당신의 결혼식을 환하게 밝혀줄 부케,<br />
                    20% 할인된 가격으로 득템hada.
                  </div>

                  {/* LAYER NR. 4 */}
                  <div className='tp-caption sfb fadeout small_white text-center'
                    data-x='left'
                    data-y='400'
                    data-speed='500'
                    data-start='1600'
                    data-easing='easeOutQuad'
                    data-endspeed='600'
                  >
                    <Link to='/' className='btn btn-default btn-animated'>
                      자세히보기 <i className='fa fa-arrow-right' />
                    </Link>
                  </div>
                </li>

                {/* 배너 2 시작 */}
                <li data-transition='random' data-slotamount='7'
                  data-masterspeed='500' data-saveperformance='on'
                  data-title='웨딩부케'
                >
                  {/* main image */}
                  <img src={`${imgRouteMainBanner}/AF1QipMI_BgNCwN4VEtpJzhCq2fzapiGR0WAixQp8VBy`}
                    alt='웨딩부케' data-bgposition='center top'
                    data-bgrepeat='no-repeat' data-bgfit='cover'
                  />

                  {/* Transparent Background */}
                  <div // eslint-disable-line
                    className='tp-caption dark-translucent-bg'
                    data-x='center'
                    data-y='bottom'
                    data-speed='600'
                    data-start='0'
                  >
                  </div>

                  {/* LAYER NR. 1 */}
                  <div className='tp-caption sfb fadeout large_white'
                    data-x='left'
                    data-y='180'
                    data-speed='500'
                    data-start='1000'
                    data-easing='easeOutQuad'
                  >
                    웨딩부케 <span className='text-default'>20%</span> 할인<br />
                    아름다운 12월의 신부를 위해
                  </div>

                  {/* LAYER NR. 2 */}
                  <div
                    className='tp-caption sfb fadeout large_white tp-resizeme hidden-xs'
                    data-x='left'
                    data-y='300'
                    data-speed='500'
                    data-start='1300'
                    data-easing='easeOutQuad'
                  >
                    <div className='separator-2 light' />
                  </div>

                  {/* LAYER NR. 3 */}
                  <div className='tp-caption sfb fadeout medium_white hidden-xs'
                    data-x='left'
                    data-y='320'
                    data-speed='500'
                    data-start='1300'
                    data-easing='easeOutQuad'
                    data-endspeed='600'
                  >
                    당신의 결혼식을 환하게 밝혀줄 부케,<br />
                    20% 할인된 가격으로 득템hada.
                  </div>

                  {/* LAYER NR. 4 */}
                  <div className='tp-caption sfb fadeout small_white text-center'
                    data-x='left'
                    data-y='400'
                    data-speed='500'
                    data-start='1600'
                    data-easing='easeOutQuad'
                    data-endspeed='600'
                  >
                    <Link to='/' className='btn btn-default btn-animated'>
                      자세히보기 <i className='fa fa-arrow-right' />
                    </Link>
                  </div>
                </li>
              </ul>
              <div className='tp-bannertimer' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MainBanner
