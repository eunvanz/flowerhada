import React from 'react'
import Header from 'components/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'
import Helmet from 'react-helmet'
import ScrollTop from 'components/ScrollTop'
import Footer from 'components/Footer'
import { ROOT } from 'common/constants'

export const CoreLayout = ({ children }) => (
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
          'href': `${ROOT}/template/fonts/font-awesome/css/font-awesome.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/fonts/fontello/css/fontello.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/plugins/magnific-popup/magnific-popup.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/plugins/rs-plugin/css/settings.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/css/animations.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/plugins/owl-carousel/owl.carousel.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/plugins/owl-carousel/owl.transitions.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/plugins/hover/hover-min.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/css/style.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/css/typography-default.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/css/skins/cool_green.css`
        },
        {
          'rel': 'stylesheet',
          'href': `${ROOT}/template/css/custom.css`
        }
      ]}
    />
    <Header />
    <ScrollTop />
    <div>
      {children}
    </div>
    <Footer />
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
