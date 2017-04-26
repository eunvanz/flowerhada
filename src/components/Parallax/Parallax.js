import React, { PropTypes } from 'react'
import { Parallax as ReactParallax } from 'react-parallax'
import { isMobile } from 'common/util'

class Parallax extends React.Component {
  render () {
    return (
      <ReactParallax
        className='dark-translucent-bg'
        strength={isMobile.any() ? 50 : 300}
        bgImage={this.props.backgroundImage}
      >
        <div className='container' style={{ paddingTop: '30px', paddingBottom: '30px' }}>
          <div className='row'>
            <div className='col-md-12'>
              <h2 className='text-center'>{this.props.title}</h2>
              {/* <div className='separator'></div> */}
              <div className='row'>
                <div className='col-md-12'>
                  <p className='text-center'>{this.props.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReactParallax>
    )
  }
}

Parallax.propTypes = {
  title: PropTypes.object.isRequired,
  description: PropTypes.object.isRequired,
  backgroundImage: PropTypes.string.isRequired
}

export default Parallax
