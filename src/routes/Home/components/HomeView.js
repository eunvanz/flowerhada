import React from 'react'
import MainBanner from './MainBanner'
import { setInlineScripts, clearInlineScripts } from 'common/util'
import HomeCard from './HomeCard'
import ItemList from 'components/ItemList'
import ActionBlock from 'components/ActionBlock'
import $ from 'jquery'
import { ROOT } from 'common/constants'

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'HomeView'
  }
  componentDidMount () {
    this.props.fetchMainBanners()
    .then(() => {
      return this.props.fetchLessons()
    })
    .then(() => {
      const scripts = [
        `${ROOT}/template/plugins/rs-plugin/js/jquery.themepunch.tools.min.js`,
        `${ROOT}/template/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js`,
        `${ROOT}/template/plugins/owl-carousel/owl.carousel.js`,
        `${ROOT}/template/plugins/jquery.browser.js`,
        `${ROOT}/template/plugins/SmoothScroll.js`,
        `${ROOT}/template/plugins/waypoints/jquery.waypoints.min.js`,
        `${ROOT}/template/plugins/magnific-popup/jquery.magnific-popup.min.js`,
        `${ROOT}/template/plugins/isotope/isotope.pkgd.min.js`,
        `${ROOT}/template/js/template.js`,
        `${ROOT}/template/js/inline-home-view.js`
      ]
      setInlineScripts(scripts)
    })
  }
  componentWillUnmount () {
    window.dispatchEvent(new Event('popstate'))
  }
  render () {
    return (
      <div>
        {this.props.mainBanners.length > 0 &&
          <MainBanner mainBanners={this.props.mainBanners} />
        }
        <section className='light-gray-bg pv-30 clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 col-md-offset-2'>
                <h2 className='text-center'>
                  <span className='text-default'>꽃</span>처럼 살아라
                </h2>
                <div className='separator' />
                <p className='large text-center'>
                  언제나 예쁘고 싱싱한 꽃처럼 살 수 없을까요? <span className='text-default'>hada</span>와 함께라면 가능합니다.<br /><span className='text-default'>hada</span>는 꽃으로 할 수 있는 풍성한 경험을 일상속으로 전달해드립니다.
                </p>
              </div>
              <HomeCard
                title='플라워레슨'
                img='flower-scissors.jpg'
                actionName='플라워레슨'
                content='꽃은 시든 일상에 생기를 불어넣어 줍니다. 플라워레슨으로 일상에 생기를 불어넣어보세요.'
                link='lessons'
              />
              <HomeCard
                title='꽃다발'
                img='flower-bunch.jpg'
                actionName='꽃다발'
                content='뜻깊은 이벤트에 꽃이 빠질 수 없겠죠? 톤 & 매너에 맞는 꽃다발로 마음을 전달하세요.'
                link='bunch'
              />
              <HomeCard
                title='웨딩'
                img='wedding-bouquet.jpg'
                actionName='웨딩'
                content='꽃이 없는 웨딩은 앙꼬 없는 찐빵. hada가 제안하는 웨딩솔루션으로 결혼식을 화사하게 밝혀보세요.'
                link='lessons/business'
              />
            </div>
          </div>
        </section>
        <ActionBlock
          title='우리동네로 call hada'
          desc='내게 맞는 레슨이 없다고 좌절하지 마세요. 여러분이 원하는 지역과 시간대로 레슨을 개설해드립니다.'
          link='/apply-lesson'
          btnTxt='출장레슨 신청'
          btnIcon='fa fa-pencil-square-o pl-20'
        />
        <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>플라워레슨
                <button className='pull-right btn btn-animated btn-default-transparent btn-sm'>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                {
                  this.props.lessons &&
                  <ItemList
                    items={this.props.lessons}
                    itemType='lesson'
                  />
                }
              </div>
            </div>
          </div>
        </section>
        {/* <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>꽃다발
                <button className='pull-right btn btn-animated btn-default-transparent btn-sm'>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                <ItemList />
              </div>
            </div>
          </div>
        </section> */}
        {/* <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>웨딩
                <button className='pull-right btn btn-animated btn-default-transparent btn-sm'>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                <ItemList />
              </div>
            </div>
          </div>
        </section> */}
      </div>
    )
  }
}

HomeView.propTypes = {
  fetchMainBanners: React.PropTypes.func.isRequired,
  mainBanners: React.PropTypes.array.isRequired,
  lessons: React.PropTypes.array.isRequired,
  fetchLessons: React.PropTypes.func.isRequired
}

export default HomeView
