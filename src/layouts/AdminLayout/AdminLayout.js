import React from 'react'
import Navigation from 'components/Navigation'

const tabTitles = ['메인배너관리', '레슨관리', '상품관리', '주문관리', '오류관리', '문의관리']
const tabIcons = ['icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star', 'icon-star']
const tabLinks = ['/admin/main-banner', '/admin/lesson', '/admin/product', '/admin/order-list', '/admin/error-list',
  '/admin/inquiry-list']

export const AdminLayout = ({ children }) => (
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

AdminLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default AdminLayout
