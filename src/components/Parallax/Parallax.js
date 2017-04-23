import React, { PropTypes } from 'react'
// import 'template/plugins/jquery.parallax-1.1.3'
import { Parallax as ReactParallax } from 'react-parallax'
import { isMobile } from 'common/util'
// import $ from 'jquery'

class Parallax extends React.Component {
  // componentDidMount () {
  //   $('.parallax').parallax('50%', 0.3)
  // }
  render () {
    return (
      // <div className='section pv-40 parallax dark-translucent-bg'
      //   style={{ background: `url(${this.props.backgroundImage}) 50% 0 no-repeat fixed`, backgroundSize: 'cover'}}
      // >
        // <div className='container'>
        //   <div className='row'>
        //     <div className='col-md-12'>
        //       <h2 className='text-center'>{this.props.title}</h2>
        //       {/* <div className='separator'></div> */}
        //       <div className='row'>
        //         <div className='col-md-12'>
        //           <p className='text-center'>{this.props.description}</p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      // </div>
      <ReactParallax
        className='dark-translucent-bg'
        strength={isMobile.any() ? 100 : 300}
        bgImage={this.props.backgroundImage}
      >
        <div className='container' style={{ paddingTop: '40px', paddingBottom: '40px' }}>
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
