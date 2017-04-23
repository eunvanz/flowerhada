import React from 'react'
import MainBanner from './MainBanner'
import { setInlineScripts, clearInlineScripts, isIE } from 'common/util'
import HomeCard from './HomeCard'
import ItemList from 'components/ItemList'
import LessonRequestActionBlock from 'components/LessonRequestActionBlock'
import Loading from 'components/Loading'
import Button from 'components/Button'
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
    this._handleOnClickMoreLesson = this._handleOnClickMoreLesson.bind(this)
    this._handleOnClickMoreFlowers = this._handleOnClickMoreFlowers.bind(this)
    this._handleOnClickMoreWeddings = this._handleOnClickMoreWeddings.bind(this)
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
        `/template/plugins/rs-plugin/js/jquery.themepunch.revolution.js`,
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
                  찾아가는 플라워레슨
                </h2>
                <div className='separator' />
                <p className='large text-center'>
                  당신의 취미를 <span className='text-default'>배달</span>해드립니다.
                </p>
              </div>
              <HomeCard
                title='원데이레슨'
                icon='fa fa-scissors'
                actionName='원데이레슨'
                content='내가 원하는 시간과 장소, 주제로 진행되는 맞춤형 레슨'
                link='/item-list/lesson/원데이레슨'
              />
              <HomeCard
                title='취미반'
                icon='fa fa-heart'
                actionName='취미반'
                content='정기적으로 다양한 작품을 만드는 지속적 힐링 레슨'
                link='/item-list/lesson/취미반'
              />
              <HomeCard
                title='창업반'
                icon='fa fa-graduation-cap'
                actionName='창업반'
                content='창업 필수 작품들을 집중적으로 다루는 전문가 과정'
                link='/item-list/lesson/창업반'
              />
              <HomeCard
                title='웨딩반'
                icon='fa fa-diamond'
                actionName='웨딩반'
                content='특별한 날, 특별한 이벤트에 꼭 필요한 공간장식 레슨'
                link='/item-list/lesson/웨딩반'
              />
              {/* <HomeCard
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
              /> */}
            </div>
          </div>
        </section>
        <LessonRequestActionBlock />
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
  user: React.PropTypes.object
}

export default HomeView
