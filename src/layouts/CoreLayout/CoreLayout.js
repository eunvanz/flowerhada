import React from 'react'
import Header from 'components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'
import Helmet from 'react-helmet'
import ScrollTop from 'components/ScrollTop'
import Footer from 'components/Footer'
import InquiryModal from 'components/InquiryModal'
import GlobalMessageModal from 'components/GlobalMessageModal'

class CoreLayout extends React.Component {
  render () {
    return (
      <div className='page-wrapper'>
        <Helmet
          title='Flowerhada - live florally!'
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
              'href': `https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css`
            }
          ]}
        />
        <Header />
        <ScrollTop />
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
