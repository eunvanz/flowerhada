import React, { PropTypes } from 'react'
import Navigation from 'components/Navigation'
import { connect } from 'react-redux'

const tabTitles = ['메인배너관리', '레슨관리', '상품관리', '주문관리', '오류관리', '문의관리', '회원관리', '강사관리']
const tabIcons = ['icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star']
const tabLinks = ['/admin/main-banner', '/admin/lesson', '/admin/product', '/admin/order-list', '/admin/error-list',
  '/admin/inquiry-list', '/admin/user-list', '/admin/tutor']

const mapStateToProps = (state) => ({
  isAdmin: state.authUser.data ? state.authUser.data.authorities.filter(obj => obj.authority === 'ADMIN').length > 0 : false
})

class AdminLayout extends React.Component {
  componentDidMount () {
    if (!this.props.isAdmin) {
      this.context.router.replace('not-found')
    }
  }
  render () {
    const { children } = this.props
    return (
      <div className='main-container'>
        <div className='container'>
          <div className='row'>
            <div className='main col-md-12'>
              <Navigation
                tabTitles={tabTitles}
                tabIcons={tabIcons}
                tabLinks={tabLinks}
              />
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AdminLayout.contextTypes = {
  router: PropTypes.object.isRequired
}

AdminLayout.propTypes = {
  children: PropTypes.element.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(AdminLayout)
