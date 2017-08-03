import React, { PropTypes } from 'react'
import { Parallax as ReactParallax } from 'react-parallax'
import { isMobile } from 'common/util'
import $ from 'jquery'

class Parallax extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      paddingTop: '30px',
      paddingBottom: '30px'
    }
  }
  componentDidMount () {
    if (this.props.height && this.props.innerComponent) {
      this.setState({
        paddingTop: `${(this.props.height - $('#innerComponent').height()) / 2}px`,
        paddingBottom: `${(this.props.height - $('#innerComponent').height()) / 2}px`
      })
    }
  }
  render () {
    return (
      <ReactParallax
        className='dark-translucent-bg'
        strength={this.props.strength || (isMobile.any() ? 50 : 300)}
        bgImage={this.props.backgroundImage}
        blur={this.props.blur}
      >
        <div className='container'
          style={{
            paddingTop: this.props.height ? `${(this.props.height - $('#innerComponent').height()) / 2}px` : '30px',
            paddingBottom: this.props.height ? `${(this.props.height - $('#innerComponent').height()) / 2}px` : '30px',
            height: `${this.props.height}px` || 'auto' }}>
          <div className='row'>
            <div className='col-md-12'>
              {this.props.title && <h2 className='text-center'>{this.props.title}</h2>}
              {/* <div className='separator'></div> */}
              {this.props.description && <div className='row'>
                <div className='col-md-12'>
                  <p className='text-center'>{this.props.description}</p>
                </div>
              </div>}
              {
                this.props.innerComponent &&
                <div id='innerComponent'>
                  {this.props.innerComponent}
                </div>
              }
            </div>
          </div>
        </div>
      </ReactParallax>
    )
  }
}

Parallax.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  backgroundImage: PropTypes.string.isRequired,
  blur: PropTypes.number,
  innerComponent: PropTypes.object,
  height: PropTypes.number,
  strength: PropTypes.number
}

export default Parallax
