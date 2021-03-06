import React from 'react'

class TextField extends React.Component {
  render () {
    return (
      <div className='form-group'>
        <label htmlFor={this.props.id}>{this.props.label} {
          this.props.imgInfo &&
          <a href={this.props.imgInfo} target='_blank'> : {this.props.imgInfo}</a>
        }</label>
        <input type={this.props.type ? this.props.type : 'text'} className='form-control'
          id={this.props.id} onChange={this.props.onChange} disabled={this.props.disabled}
          value={this.props.value} data-limit={this.props.limit} style={this.props.style}
          step={this.props.step} placeholder={this.props.placeholder} data-id={this.props.dataId}
          data-type={this.props.dataType} />
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
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.any,
  type: React.PropTypes.string,
  limit: React.PropTypes.number, // 글자수 제한
  length: React.PropTypes.number, // 현재 글자 수
  style: React.PropTypes.object,
  disabled: React.PropTypes.bool,
  step: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  imgInfo: React.PropTypes.string,
  dataId: React.PropTypes.any,
  dataType: React.PropTypes.string
}

export default TextField
