import React from 'react'

class Loading extends React.Component {
  render () {
    return (
      <div className='text-center' style={{ height: '200px' }}>
        <div style={{ position: 'relative', top: '90px' }}>
          <i className='fa fa-spinner fa-pulse fa-fw' /> {this.props.text}
        </div>
      </div>
    )
  }
}

Loading.propTypes = {
  text: React.PropTypes.string.isRequired
}

export default Loading
