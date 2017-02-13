import React from 'react'

class LinkButton extends React.Component {
  render () {
    return (
      <a className='btn-sm-link'
        style={{ cursor: 'pointer' }}
        onClick={this.props.onClick}>{this.props.textComponent}</a>
    )
  }
}

LinkButton.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  textComponent: React.PropTypes.object.isRequired
}

export default LinkButton
