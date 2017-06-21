import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import $ from 'jquery'
import { isMobile } from 'common/util'
import Button from 'components/Button'

const swiperSliderStyle = {
  textAlign: 'center',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  height: `${document.innerWidth * 3 / 5}px`
}

const swiperContainerStyle = {
  width: '100%',
  height: `${document.innerWidth * 3 / 5}px`
}

const swiperImgStyle = {
  width: '100%'
}

class WeddingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mainParallaxHeight: null
    }
    this._handleOnClickInquiry = this._handleOnClickInquiry.bind(this)
  }
  componentDidMount () {
    let height = window.innerHeight - $('.header-container').height()
    if (height / window.innerWidth > 3 / 5) height = window.innerWidth * 3 / 5
    this.setState({ mainParallaxHeight: height })
    // window.$('.isotope-container').fadeIn()
    // window.$('.isotope-container').isotope({
    //   itemSelector: '.isotope-item',
    //   layoutMode: 'masonry',
    //   transitionDuration: '0.6s'
    // })
    const Swiper = window.Swiper
    Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 30,
      loop: true,
      autoplay: 2500
    })
  }
  _handleOnClickInquiry () {
    const inquiryModal = {
      inquiry: { title: '공간장식 문의드립니다.' },
      show: true,
      process: false,
      defaultCategory: '공간장식문의',
      afterSubmit: () => {
        let message = this.props.user ? '문의가 완료되었습니다. 문의 내역은 "마이페이지"에서도 확인하실 수 있습니다.' : '문의가 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.' // eslint-disable-line
        const messageModal = {
          show: true,
          message,
          cancelBtnTxt: null,
          confirmBtnTxt: '확인',
          onConfirmClick: () => {
            this.props.setMessageModalShow(false)
          },
          process: false
        }
        this.props.setMessageModal(messageModal)
      },
      mode: 'post'
    }
    this.props.setInquiryModal(inquiryModal)
  }
  render () {
    return (
      <div>
        <Parallax
          innerComponent={
            <div>
              <h1 className='page-title text-center'>꽃하다 파티플래닝</h1>
              <div className='separator' />
              <p className='lead text-center'>
                꽃은 특별한 날을 최상의 컨디션으로 추억할 수 있는 필수품입니다.
              </p>
            </div>
          }
          height={this.state.mainParallaxHeight}
          backgroundImage='http://i.imgur.com/MWcpA0g.jpg'
          strength={isMobile.any() ? 50 : 200}
        />
        <section className='main-container'>
          <div className='container'>
            <div className='main'>
              <h1 className='page-title text-center'>최적의 공간장식 솔루션</h1>
              <div className='separator' />
              <p className='large text-center margin-clear'>
                꽃하다의 파티플래닝은 거품을 줄인 합리적인 가격으로 고객의 니즈를 만족시키고 있습니다.<br />
                고객님의 성향과 공간의 분위기를 고려한 공간장식으로 기억에 오래남는 파티를 만들어보세요.
              </p>
            </div>
          </div>
        </section>
        <div className='swiper-container' style={swiperContainerStyle}>
          <div className='swiper-wrapper'>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/cImVLB1.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/qRbomxU.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/CIazVNP.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/92hyKAo.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/haAzovD.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/wDab2Ds.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/ZChxiRA.jpg' style={swiperImgStyle} />
            </div>
            <div className='swiper-slide' style={swiperSliderStyle}>
              <img src='http://i.imgur.com/IEwEZn9.jpg' style={swiperImgStyle} />
            </div>
          </div>
          <div className='swiper-pagination swiper-pagination-white' />
          <div className='swiper-button-next swiper-button-white' />
          <div className='swiper-button-prev swiper-button-white' />
        </div>
        {/* <div className='isotope-container row grid-space-0'>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/oBBXlYR.jpg' />
          </div>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/YLDGBFL.jpg' />
          </div>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/0T6Qr6Z.jpg?1' />
          </div>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/JdrGTJF.jpg' />
          </div>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/8Y6QqoY.jpg' />
          </div>
          <div className='col-sm-6 isotope-item'>
            <img src='http://i.imgur.com/DD88v4Y.jpg?1' />
          </div>
        </div> */}
        <section className='section light-gray-bg pv-40 clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='call-to-action text-center'>
                  <div className='row'>
                    <div className='col-sm-8 col-sm-offset-2'>
                      <h2 className='title'>파티를 계획중이신가요?</h2>
                      <p>아래의 버튼을 눌러 성공적인 파티의 첫 걸음을 내딛으세요.</p>
                      <div className='separator' />
                      <Button
                        size='lg'
                        animated
                        textComponent={<span>문의하기 <i className='fa fa-pencil-square-o' /></span>}
                        onClick={this._handleOnClickInquiry}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

WeddingView.contextTypes = {
  router: PropTypes.object.isRequired
}

WeddingView.propTypes = {
  setMessageModalShow: React.PropTypes.func.isRequired,
  setMessageModal: React.PropTypes.func.isRequired,
  setInquiryModal: React.PropTypes.func.isRequired,
  user: React.PropTypes.object
}

export default WeddingView
