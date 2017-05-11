import React from 'react'
import MainContainer from 'components/MainContainer'

const renderBody = (children) => {
  return (
    <div>
      {children}
    </div>
  )
}

export const AdminLayout = ({ children }) => (
  <MainContainer
    title='hada NEWS'
    bodyComponent={renderBody(children)}
  />
)

AdminLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default AdminLayout
