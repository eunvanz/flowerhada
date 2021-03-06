import React from 'react'
import Header from 'components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'
import Helmet from 'react-helmet'
import ScrollTop from 'components/ScrollTop'
import Footer from 'components/Footer'
import InquiryModal from 'components/InquiryModal'
import GlobalMessageModal from 'components/GlobalMessageModal'
import GoBack from 'components/GoBack'
import $ from 'jquery'
import { isMobile } from 'common/util'
import { LOGO_FONT } from 'common/constants'

class CoreLayout extends React.Component {
  componentDidMount () {
    /* eslint-disable */
    $(window).scroll(function() {
			if($(this).scrollTop() != 0) {
				$("#scrollTop").fadeIn();
			} else {
				$("#scrollTop").fadeOut();
			}
		});

		$("#scrollTop").click(function() {
			$("body,html").animate({scrollTop:0},800);
		});
    /* eslint-enable */
  }
  render () {
    return (
      <div className='page-wrapper'>
        <Helmet
          title='꽃하다 - live florally!'
          link={[
            {
              'rel': 'stylesheet',
              'type': 'text/css',
              'href': 'http://cdn.jsdelivr.net/font-nanum/1.0/nanumbarungothic/nanumbarungothic.css'
            },
            {
              'rel': 'stylesheet',
              'type': 'text/css',
              'href': 'https://fonts.googleapis.com/css?family=Archivo+Black'
            },
            {
              'rel': 'stylesheet',
              'type': 'text/css',
              'href': `https://fonts.googleapis.com/css?family=${LOGO_FONT}`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/fonts/font-awesome/css/font-awesome.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/fonts/fontello/css/fontello.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/plugins/magnific-popup/magnific-popup.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/plugins/rs-plugin/css/settings.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/css/animations.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/plugins/owl-carousel/owl.carousel.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/plugins/owl-carousel/owl.transitions.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/plugins/hover/hover-min.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/css/style.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/css/typography-default.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/css/skins/cool_green.css`
            },
            {
              'rel': 'stylesheet',
              'href': `/template/css/custom.css`
            },
            {
              'rel': 'stylesheet',
              'href': `https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.2/css/swiper.min.css`
            }
          ]}
          meta={[
            {
              name: 'description',
              content: '출장 플라워레슨, 단체꽃다발, 부케, 꽃바구니, 꽃이 있는 웨딩, 파티, 공간장식이 필요하다면 꽃하다를 찾아주세요.'
            },
            {
              property: 'og:type',
              content: 'website'
            },
            {
              property: 'og:title',
              content: '꽃하다'
            },
            {
              property: 'og:description',
              content: '출장 플라워레슨, 단체꽃다발, 부케, 꽃바구니, 꽃이 있는 웨딩, 파티, 공간장식이 필요하다면 꽃하다를 찾아주세요.'
            },
            {
              property: 'og:image',
              content: 'http://i.imgur.com/VCJ1Bqd.jpg'
            },
            {
              property: 'og:url',
              content: 'http://flowerhada.com'
            }
          ]}
        />
        <Header />
        <ScrollTop />
        { location.pathname !== '/' && isMobile.any() && <GoBack /> }
        <InquiryModal />
        <GlobalMessageModal />
        <div>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
