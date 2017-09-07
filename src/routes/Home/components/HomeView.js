import React from 'react'
import MainBanner from './MainBanner'
import { setInlineScripts, clearInlineScripts, isIE, isScreenSize } from 'common/util'
import HomeCard from './HomeCard'
import ItemList from 'components/ItemList'
import LessonRequestActionBlock from 'components/LessonRequestActionBlock'
import Loading from 'components/Loading'
import Button from 'components/Button'
import { sortLessonsByLessonDayDesc } from 'common/util'
// import 'template/plugins/rs-plugin/js/jquery.themepunch.tools.min.js'
// import 'template/plugins/rs-plugin/js/jquery.themepunch.revolution.min.js'
// import 'template/plugins/owl-carousel/owl.carousel.js'
// import 'template/plugins/jquery.browser.js'
// import 'template/plugins/SmoothScroll.js'
// import 'template/plugins/waypoints/jquery.waypoints.min.js'
// import 'template/plugins/magnific-popup/jquery.magnific-popup.min.js'
// import 'template/plugins/isotope/isotope.pkgd.min.js'
// import '/template/js/template.js'
// import '/template/js/inline-home-view.js'

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'HomeView'
    this.state = {
      showLessonCards: !isScreenSize.xs()
    }
    this._handleOnClickMoreLesson = this._handleOnClickMoreLesson.bind(this)
    this._handleOnClickMoreFlowers = this._handleOnClickMoreFlowers.bind(this)
    this._handleOnClickMoreWeddings = this._handleOnClickMoreWeddings.bind(this)
    this._showLessonCards = this._showLessonCards.bind(this)
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
        // `/template/plugins/rs-plugin/js/jquery.themepunch.tools.min.js`,
        // `/template/plugins/rs-plugin/js/jquery.themepunch.revolution.js`,
        // `/template/plugins/owl-carousel/owl.carousel.js`,
        // `/template/plugins/jquery.browser.js`,
        // `/template/plugins/SmoothScroll.js`,
        // `/template/plugins/waypoints/jquery.waypoints.min.js`,
        // `/template/plugins/magnific-popup/jquery.magnific-popup.min.js`,
        // `/template/plugins/isotope/isotope.pkgd.min.js`,
        `/template/js/template.js`
      ]
      setInlineScripts(scripts)
      window.addEventListener('popstate', () => {
        if (location.pathname !== '/') window.$('#main-banner').revkill()
      })
    })
  }
  componentWillUnmount () {
    if (isIE()) {
      const evt = document.createEvent('Event')
      evt.initEvent('popstate', true, false)
      document.dispatchEvent(evt)
    } else {
      window.dispatchEvent(new Event('popstate'))
    }
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
  _showLessonCards () {
    this.setState({ showLessonCards: true })
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
        return <ItemList items={sortLessonsByLessonDayDesc(this.props.lessons).filter(lesson => lesson.activated).slice(0, 3)} itemType='lesson' />
      } else {
        return <Loading text='레슨 목록을 불러오는 중..' />
      }
    }
    const renderFlowers = () => {
      if (this.props.products) {
        return <ItemList
          items={this.props.products.filter(product => product.mainCategory === '꽃다발').slice(0, 3)}
          itemType='product' />
      } else {
        return <Loading text='꽃다발 목록을 불러오는 중..' />
      }
    }
    const renderWeddings = () => {
      if (this.props.products) {
        return <ItemList
          items={this.props.products.filter(product => product.mainCategory === '웨딩').slice(0, 3)}
          itemType='product' />
      } else {
        return <Loading text='웨딩상품 목록을 불러오는 중..' />
      }
    }
    return (
      <div>
        {renderBanner()}
        <section className={`light-gray-bg ${isScreenSize.xs() ? '' : 'pv-30'} clearfix`}
          style={{ paddingTop: '30px', paddingBottom: this.state.showLessonCards ? '30px' : '0px' }}>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 col-md-offset-2'>
                <h2 className='text-center'>
                  <span className='text-default'>찾아가는</span> 플라워레슨
                </h2>
                <div className='separator' />
                <p className='large text-center'>
                  당신의 취미를 <span className='text-default'>배달</span>해드립니다.
                </p>
              </div>
              {
                !this.state.showLessonCards &&
                <Button
                  className='btn-block'
                  square
                  color='default'
                  textComponent={<span>어떤 종류의 레슨이 있나요? <i className='fa fa-chevron-down' /></span>}
                  style={{ marginBottom: '0px' }}
                  onClick={this._showLessonCards}
                />
              }
              {
                this.state.showLessonCards &&
                <div>
                  <HomeCard
                    title='원데이레슨'
                    img='flower-basket.svg'
                    actionName='원데이레슨'
                    content='내가 원하는 시간과 장소, 주제로 진행되는 맞춤형 레슨'
                    link='/item-list/lesson/원데이레슨'
                  />
                  <HomeCard
                    title='취미반'
                    img='healing.svg'
                    actionName='취미반'
                    content='정기적으로 다양한 작품을 만드는 지속형 힐링 레슨'
                    link='/item-list/lesson/취미반'
                  />
                  <HomeCard
                    title='창업반'
                    img='graduation.svg'
                    actionName='창업반'
                    content='창업 필수 작품들을 집중적으로 다루는 전문가 과정'
                    link='/item-list/lesson/창업반'
                  />
                  <HomeCard
                    title='웨딩반'
                    img='wedding-ring.svg'
                    actionName='웨딩반'
                    content='특별한 날, 특별한 이벤트에 꼭 필요한 공간장식 레슨'
                    link='/item-list/lesson/웨딩반'
                  />
                </div>
              }
            </div>
          </div>
        </section>
        <div>
          {
            !isScreenSize.xs() &&
            <LessonRequestActionBlock />
          }
        </div>
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
        <div className='visible-xs'>
          <LessonRequestActionBlock />
        </div>
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
  naver: React.PropTypes.object
}

export default HomeView
