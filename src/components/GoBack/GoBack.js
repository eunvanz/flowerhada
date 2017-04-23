import React, { PropTypes } from 'react'

class GoBack extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickLeft = this._handleOnClickLeft.bind(this)
  }
  _handleOnClickLeft () {
    this.context.router.goBack()
  }
  render () {
    return (
      <div className='scrollToTop circle' style={{ left: '5px', display: 'block' }} onClick={this._handleOnClickLeft}><i className='fa fa-long-arrow-left' /></div>
    )
  }
}

GoBack.contextTypes = {
  router: PropTypes.object.isRequired
}

export default GoBack
