import React from 'react'

class Loading extends React.Component {
  render () {
    return (
      <div className='text-center' style={Object.assign({}, { height: '200px' }, this.props.style)}>
        <div style={{ position: 'relative', top: '90px' }}>
          <i className='fa fa-circle-o-notch fa-spin fa-fw' /> {this.props.text}
        </div>
      </div>
    )
  }
}

Loading.propTypes = {
  text: React.PropTypes.string.isRequired,
  style: React.PropTypes.object
}

export default Loading
