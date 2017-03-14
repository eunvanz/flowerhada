import React, { PropTypes } from 'react'

class Alert extends React.Component {
  render () {
    const getIcon = () => {
      const type = this.props.type
      if (type === 'warning') {
        return 'warning'
      } else if (type === 'success') {
        return 'check'
      } else if (type === 'info') {
        return 'info-circle'
      } else if (type === 'danger') {
        return 'times'
      }
    }
    return (
      <div className={`alert alert-icon alert-${this.props.type} ${this.props.className ? this.props.className : ''}`} role='alert'>
        <i className={`fa fa-${getIcon()}`} />
        {this.props.text}
      </div>
    )
  }
}

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default Alert
