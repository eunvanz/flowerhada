import React from 'react'
import ReactBootstrapDatePicker from 'react-bootstrap-date-picker'

class DatePicker extends React.Component {
  render () {
    return (
      <ReactBootstrapDatePicker
        style={{ width: '200px' }}
        showClearButton={false}
        id={this.props.id}
        onChange={this.props.onChange}
        value={this.props.value}
        dateFormat='YYYY-MM-DD'
        dayLabels={['일', '월', '화', '수', '목', '금', '토']}
        monthLabels={['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']}
      />
    )
  }
}

DatePicker.propTypes = {
  id: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
}

export default DatePicker
