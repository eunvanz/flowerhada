import React from 'react'

class AdminView extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'AdminView'
    this.state = {
      state: null
    }
  }
  render () {
    <div>
      content
    </div>
  }
}

AdminView.propTypes = {
  prop     : React.PropTypes.number.isRequired
}

export default AdminView
