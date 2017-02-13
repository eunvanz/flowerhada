import React, { PropTypes } from 'react'

class Button extends React.Component {
  render () {
    const color = () => {
      let result = this.props.link ? ' link-' : ' btn-'
      switch (this.props.color) {
        case 'white': {
          result += 'default-transparent'
          break
        }
        case 'dark-bordered': {
          result += 'gray-transparent'
          break
        }
        case 'gray': {
          result += 'gray'
          break
        }
        case 'dark': {
          result += 'dark'
          break
        }
        default: {
          result += 'default'
        }
      }
      return result
    }
    const size = () => {
      let result = ` ${this.props.link ? 'btn-md-link' : ''}`
      switch (this.props.size) {
        case 'sm': {
          result = ` btn-sm${this.props.link ? '-link' : ''}`
          break
        }
        case 'lg': {
          result = ` btn-lg${this.props.link ? '-link' : ''}`
          break
        }
        case 'xl': {
          result = ' btn-xl'
          break
        }
      }
      return result
    }
    const animated = () => {
      let result = ''
      if (this.props.animated) {
        result = ' btn-animated'
      }
      return result
    }
    return (
      <a
        id={this.props.id}
        href={this.props.href}
        className={`${this.props.link ? '' : 'btn'}${this.props.square ? ' square' : ''}
        ${this.props.circle ? ' radius-50' : ''}${color()}${size()}${animated()} ${this.props.className}`}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.process ? <span>처리중... <i className='fa fa-spinner fa-pulse' /></span> : this.props.textComponent}
      </a>
    )
  }
}

Button.propTypes = {
  href: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  animated: PropTypes.bool,
  textComponent: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
  link: PropTypes.bool,
  square: PropTypes.bool,
  circle: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  process: PropTypes.bool
}

export default Button
