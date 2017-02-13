import React from 'react'
import Navigation from '../../components/Navigation'

export const SubLayout = ({ children }) => (
  <div className='main-container'>
    <div className='container'>
      <div className='row'>
        <div className='main col-md-12'>
          <Navigation />
          {children}
        </div>
      </div>
    </div>
  </div>
)

SubLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SubLayout
