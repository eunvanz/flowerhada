import React from 'react'
import Navigation from 'components/Navigation'
import MainContainer from 'components/MainContainer'

const renderNav = () => {
  return (
    <Navigation
      tabTitles={['내 정보', '구매목록', '포인트', '1:1문의']}
      tabIcons={['fa fa-user', 'fa fa-shopping-basket', 'fa fa-product-hunt', 'fa fa-question-circle']}
      tabLinks={['/my-page/profile', '/my-page/order-list', '/my-page/point-history', '/my-page/inquiry-list']}
    />
  )
}

const renderBody = (children) => {
  return (
    <div>
      {renderNav()}
      {children}
    </div>
  )
}

export const AdminLayout = ({ children }) => (
  <MainContainer
    title='마이페이지'
    bodyComponent={renderBody(children)}
  />
)

AdminLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default AdminLayout
