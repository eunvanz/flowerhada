import React from 'react'
import MainBanner from './MainBanner'
import { setInlineScripts, clearInlineScripts } from 'common/util'
import HomeCard from './HomeCard'
import ItemList from 'components/ItemList'
import ActionBlock from 'components/ActionBlock'
import Loading from 'components/Loading'
import Button from 'components/Button'
// import 'template/plugins/jquery.themepunch.tools.min.js'
// import 'template/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js'
// import 'template/plugins/owl-carousel/owl.carousel.js'
// import 'template/plugins/jquery.browser.js'
// import 'template/plugins/SmoothScroll.js'
// import 'template/plugins/waypoints/jquery.waypoints.min.js'
// import 'template/plugins/magnific-popup/jquery.magnific-popup.min.js'
// import 'template/plugins/isotope/isotope.pkgd.min.js'
// import 'template/js/template.js'
// import 'template/js/inline-home-view.js'

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'HomeView'
    this._handleOnClickMoreLesson = this._handleOnClickMoreLesson.bind(this)
    this._handleOnClickMoreFlowers = this._handleOnClickMoreFlowers.bind(this)
    this._handleOnClickMoreWeddings = this._handleOnClickMoreWeddings.bind(this)
    this._handleOnClickRequestLesson = this._handleOnClickRequestLesson.bind(this)
  }
  componentDidMount () {
    this.props.fetchMainBanners()
    .then(() => {
      return this.props.fetchLessons()
    })
    .then(() => {
      return this.props.fetchProducts()
    })
    .then(() => {
      const scripts = [
        `/template/plugins/rs-plugin/js/jquery.themepunch.tools.min.js`,
        `/template/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js`,
        `/template/plugins/owl-carousel/owl.carousel.js`,
        `/template/plugins/jquery.browser.js`,
        `/template/plugins/SmoothScroll.js`,
        `/template/plugins/waypoints/jquery.waypoints.min.js`,
        `/template/plugins/magnific-popup/jquery.magnific-popup.min.js`,
        `/template/plugins/isotope/isotope.pkgd.min.js`,
        `/template/js/template.js`,
        `/template/js/inline-home-view.js`
      ]
      setInlineScripts(scripts)
    })
  }
  componentWillUnmount () {
    window.dispatchEvent(new Event('popstate'))
    clearInlineScripts()
  }
  _handleOnClickMoreLesson () {
    this.context.router.push('/item-list/lesson/all')
  }
  _handleOnClickMoreFlowers () {
    this.context.router.push('/item-list/flower/all')
  }
  _handleOnClickMoreWeddings () {
    this.context.router.push('/item-list/wedding/all')
  }
  _handleOnClickRequestLesson () {
    this.props.setInquiryModalDefaultCategory('출장레슨신청')
    this.props.setInquiryModalAfterSubmit(() => {
      let message = this.props.user ? '문의가 완료되었습니다. 문의 내역은 "마이페이지"에서도 확인하실 수 있습니다.' : '문의가 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.'
      this.props.setMessageModalMessage(message)
      this.props.setMessageModalCancelBtnTxt(null)
      this.props.setMessageModalConfirmBtnTxt('확인')
      this.props.setMessageModalOnConfirmClick(() => this.props.setMessageModalShow(false))
      this.props.setMessageModalShow(true)
    })
    this.props.setInquiryModalMode('post')
    this.props.setInquiryModalShow(true)
  }
  render () {
    const renderBanner = () => {
      if (this.props.mainBanners.length > 0) {
        return <MainBanner mainBanners={this.props.mainBanners} />
      } else {
        return <Loading text='배너를 불러오는 중..' />
      }
    }
    const renderLessons = () => {
      if (this.props.lessons) {
        return <ItemList items={this.props.lessons} itemType='lesson' />
      } else {
        return <Loading text='레슨 목록을 불러오는 중..' />
      }
    }
    const renderFlowers = () => {
      if (this.props.products) {
        return <ItemList
          items={this.props.products.filter(product => product.mainCategory === '꽃다발')} itemType='product' />
      } else {
        return <Loading text='꽃다발 목록을 불러오는 중..' />
      }
    }
    const renderWeddings = () => {
      if (this.props.products) {
        return <ItemList
          items={this.props.products.filter(product => product.mainCategory === '웨딩')} itemType='product' />
      } else {
        return <Loading text='웨딩상품 목록을 불러오는 중..' />
      }
    }
    return (
      <div>
        {renderBanner()}
        <section className='light-gray-bg pv-30 clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 col-md-offset-2'>
                <h2 className='text-center'>
                  <span className='text-default'>꽃</span>처럼 살아라
                </h2>
                <div className='separator' />
                <p className='large text-center'>
                  언제나 예쁘고 싱싱한 꽃처럼 살 수 없을까요? <span className='text-default'>hada</span>와 함께라면 가능합니다.
                  <br /><span className='text-default'>hada</span>는 꽃으로 할 수 있는 풍성한 경험을 일상속으로 전달해드립니다.
                </p>
              </div>
              <HomeCard
                title='플라워레슨'
                img='flower-scissors.jpg'
                actionName='플라워레슨'
                content='꽃은 시든 일상에 생기를 불어넣어 줍니다. 플라워레슨으로 일상에 생기를 불어넣어보세요.'
                link='/item-list/lesson/all'
              />
              <HomeCard
                title='꽃다발'
                img='flower-bunch.jpg'
                actionName='꽃다발'
                content='뜻깊은 이벤트에 꽃이 빠질 수 없겠죠? 톤 & 매너에 맞는 꽃다발로 마음을 전달하세요.'
                link='/item-list/flower/all'
              />
              <HomeCard
                title='웨딩'
                img='wedding-bouquet.jpg'
                actionName='웨딩'
                content='꽃이 없는 웨딩은 앙꼬 없는 찐빵. hada가 제안하는 웨딩솔루션으로 결혼식을 화사하게 밝혀보세요.'
                link='/item-list/wedding/all'
              />
            </div>
          </div>
        </section>
        <ActionBlock
          title='우리동네로 call hada'
          desc='내게 맞는 레슨이 없다고 좌절하지 마세요. 여러분이 원하는 지역과 시간대로 레슨을 개설해드립니다.'
          onClick={this._handleOnClickRequestLesson}
          btnTxt='출장레슨 신청'
          btnIcon='fa fa-pencil-square-o pl-20'
        />
        <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>플라워레슨
                <button className='pull-right btn btn-animated btn-default-transparent btn-sm'
                  onClick={this._handleOnClickMoreLesson}>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                {renderLessons()}
                <Button
                  className='btn-block'
                  onClick={this._handleOnClickMoreLesson}
                  process={false}
                  square
                  color='gray'
                  textComponent={
                    <span>
                      <i className='text-default fa fa-plus' /> 더 많은 레슨 보기
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>꽃다발
                <button onClick={this._handleOnClickMoreFlowers}
                  className='pull-right btn btn-animated btn-default-transparent btn-sm'>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                {renderFlowers()}
                <Button
                  className='btn-block'
                  onClick={this._handleOnClickMoreFlowers}
                  process={false}
                  square
                  color='gray'
                  textComponent={
                    <span>
                      <i className='text-default fa fa-plus' /> 더 많은 꽃다발 보기
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className='section white-bg clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h3>웨딩
                <button className='pull-right btn btn-animated btn-default-transparent btn-sm'>
                  더 보기
                  <i className='fa fa-plus' />
                </button></h3>
                <hr />
                {renderWeddings()}
                <Button
                  className='btn-block'
                  onClick={this._handleOnClickMoreWeddings}
                  process={false}
                  square
                  color='gray'
                  textComponent={
                    <span>
                      <i className='text-default fa fa-plus' /> 더 많은 웨딩상품 보기
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

HomeView.contextTypes = {
  router: React.PropTypes.object
}

HomeView.propTypes = {
  fetchMainBanners: React.PropTypes.func.isRequired,
  mainBanners: React.PropTypes.array.isRequired,
  lessons: React.PropTypes.array,
  fetchLessons: React.PropTypes.func.isRequired,
  products: React.PropTypes.array,
  fetchProducts: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  setInquiryModalShow: React.PropTypes.func.isRequired,
  setInquiryModalInquiry: React.PropTypes.func.isRequired,
  setInquiryModalDefaultCategory: React.PropTypes.func.isRequired,
  setInquiryModalMode: React.PropTypes.func.isRequired,
  setInquiryModalAfterSubmit: React.PropTypes.func.isRequired,
  setMessageModalShow: React.PropTypes.func.isRequired,
  setMessageModalMessage: React.PropTypes.func.isRequired,
  setMessageModalCancelBtnTxt: React.PropTypes.func.isRequired,
  setMessageModalConfirmBtnTxt: React.PropTypes.func.isRequired,
  setMessageModalOnConfirmClick: React.PropTypes.func.isRequired
}

export default HomeView
