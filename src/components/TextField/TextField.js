import React from 'react'

class TextField extends React.Component {
  render () {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input type={this.props.type ? this.props.type : 'text'} className='form-control'
          id={this.props.id} onChange={this.props.onChange}
          value={this.props.value} data-limit={this.props.limit} />
        {
          this.props.limit &&
          <div className='text-right small'>
            (<span className='text-default'>{this.props.length}</span>/{this.props.limit})
          </div>
        }
      </div>
    )
  }
}

TextField.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  limit: React.PropTypes.number,
  length: React.PropTypes.number
}

export default TextField
