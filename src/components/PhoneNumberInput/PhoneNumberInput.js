import React, { PropTypes } from 'react'

class PhoneNumberInput extends React.Component {
  render () {
    return (
      <div>
        <select className='form-control' data-index={0} data-seq={this.props.seq} style={{ width: '80px', display: 'inline' }}
          value={this.props.valueStart} onChange={this.props.onChange}>
          <option value='010'>010</option>
          <option value='011'>011</option>
          <option value='016'>016</option>
          <option value='017'>017</option>
          <option value='018'>018</option>
          <option value='019'>019</option>
        </select>-
        <input type='text' className='form-control' data-index={1} data-seq={this.props.seq} style={{ width: '80px', display: 'inline', padding: '6px 12px' }}
          maxLength='4' pattern='[0-9]{4}'
          value={this.props.valueMid} onChange={this.props.onChange} />-
        <input type='text' className='form-control' data-index={2} data-seq={this.props.seq} style={{ width: '80px', display: 'inline', padding: '6px 12px' }}
          maxLength='4' pattern='[0-9]{4}' onBlur={this.props.onBlur}
          value={this.props.valueEnd} onChange={this.props.onChange} />
      </div>
    )
  }
}

PhoneNumberInput.propTypes = {
  valueStart: PropTypes.string.isRequired,
  valueMid: PropTypes.string.isRequired,
  valueEnd: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  seq: PropTypes.number,
  onBlur: PropTypes.func
}

export default PhoneNumberInput
