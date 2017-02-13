import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import $ from 'jquery'

class CustomModal extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'CustomModal'
    this.state = {
      showModal: this.props.show
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ showModal: nextProps.show })
  }
  componentDidUpdate () {
    $('.modal-backdrop').css('z-index', '1030').css('height', '100%')
    if (this.props.width) {
      $('.modal-dialog').css('width', 'auto')
      $(`#${this.props.id}>.modal-dialog`).css('max-width', this.props.width)
    }
  }
  render () {
    const renderHeader = () => {
      if (this.props.title) {
        return (
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
        )
      }
    }
    return (
      <div>
        <Modal id={this.props.id} show={this.state.showModal} onHide={this.props.close} backdrop={this.props.backdrop}>
          { renderHeader() }
          <Modal.Body>
            {this.props.bodyComponent}
          </Modal.Body>
          <Modal.Footer>
            {this.props.footerComponent}
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

CustomModal.propTypes = {
  title: PropTypes.string,
  bodyComponent: PropTypes.element.isRequired,
  footerComponent: PropTypes.element.isRequired,
  width: PropTypes.string,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
  backdrop: PropTypes.any,
  id: PropTypes.string
}

export default CustomModal
