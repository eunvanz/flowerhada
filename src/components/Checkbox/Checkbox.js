import React from 'react'

class Checkbox extends React.Component {
  render () {
    return (
      <div className='checkbox'>
        <label>
          <input type='checkbox' id={this.props.id}
            onChange={this.props.onChange}
            checked={this.props.checked} /> {this.props.label}
        </label>
      </div>
    )
  }
}

Checkbox.propTypes = {
  id: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  checked: React.PropTypes.string,
  label: React.PropTypes.string.isRequired
}

export default Checkbox
