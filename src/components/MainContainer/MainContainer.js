import React, { PropTypes } from 'react'

class MainContainer extends React.Component {
  render () {
    const renderTitle = () => {
      if (!this.props.title) return
      return (
        <div>
          <h2 className='page-title'>{this.props.title}</h2>
          <div className='separator-2'></div>
        </div>
      )
    }
    return (
      <section className='main-container'>
        <div className='container'>
          <div className='row'>
            <div className='main col-md-12'>
              {renderTitle()}
              {this.props.bodyComponent}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

MainContainer.propTypes = {
  title: PropTypes.string,
  bodyComponent: PropTypes.element.isRequired
}

export default MainContainer
