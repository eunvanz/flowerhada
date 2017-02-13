import React from 'react'

class TimePicker extends React.Component {
  render () {
    return (
      <div id={this.props.id} className='form-inline'>
        <button className='btn btn-default-transparent' style={{ marginRight: '3px' }}
          onClick={this.props.onClickAmPm} data-index={this.props.index}
          data-type={`${this.props.type}`} data-flag='amPm'>
          {this.props.amPm === 'AM' ? '오전' : '오후'}
        </button>
        <select className='form-control' style={{ marginRight: '3px' }}
          onChange={this.props.onChangeHour} value={this.props.hour}
          data-index={this.props.index} data-type={`${this.props.type}`} data-flag='hour'>
          <option value={1}>01</option>
          <option value={2}>02</option>
          <option value={3}>03</option>
          <option value={4}>04</option>
          <option value={5}>05</option>
          <option value={6}>06</option>
          <option value={7}>07</option>
          <option value={8}>08</option>
          <option value={9}>09</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
        </select>
        <span style={{ marginRight: '3px' }}>시</span>
        <select className='form-control' style={{ marginRight: '3px' }}
          onChange={this.props.onChangeMin} value={this.props.min}
          data-index={this.props.index} data-type={`${this.props.type}`} data-flag='min'>
          <option value={0}>00</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </select>
         분
      </div>
    )
  }
}

TimePicker.propTypes = {
  id: React.PropTypes.string,
  hour: React.PropTypes.number,
  min: React.PropTypes.number,
  amPm: React.PropTypes.string,
  onChangeHour: React.PropTypes.func.isRequired,
  onChangeMin: React.PropTypes.func.isRequired,
  onClickAmPm: React.PropTypes.func.isRequired,
  index: React.PropTypes.number,
  type: React.PropTypes.string
}

export default TimePicker
