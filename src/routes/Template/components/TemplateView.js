import React from 'react'

class Template extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Template'
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

Template.propTypes = {
  prop     : React.PropTypes.number.isRequired
}

export default Template
