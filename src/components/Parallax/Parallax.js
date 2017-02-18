import React, { PropTypes } from 'react'

class Parallax extends React.Component {
  render () {
    /* eslint-disable */
    return (
      <div className='section pv-40 parallax dark-translucent-bg'
        style={{ backgroundImage: 'url(http://digitalhint.net/wp-content/uploads/2016/04/flower-basket-on-a-table-flower-hd-wallpaper-1920x1080-7960.jpg)' }}>
        <div className='container'>
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
      </div>
    )
    /* eslint-enable */
  }
}

Parallax.propTypes = {
  title: PropTypes.object.isRequired,
  description: PropTypes.object.isRequired
}

export default Parallax
