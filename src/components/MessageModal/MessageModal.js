import React, { PropTypes } from 'react'
import CustomModal from '../CustomModal'
import Button from '../Button'

class MessageModal extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'MessageModal'
    this.state = {
      showModal: false
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ showModal: nextProps.show })
  }
  render () {
    const bodyComponent = () => {
      return (
        <div>{this.props.message}</div>
      )
    }
    const renderCancelBtn = () => {
      if (this.props.cancelBtnTxt) {
        return (
          <Button
            size='sm'
            color='dark'
            className='margin-clear'
            onClick={this.props.close}
            textComponent={<span>{this.props.cancelBtnTxt}</span>}
          />
        )
      }
    }
    const renderConfirmBtn = () => {
      if (this.props.confirmBtnTxt) {
        return (
          <Button
            size='sm'
            className='margin-clear'
            onClick={this.props.onConfirmClick}
            process={this.props.process}
            textComponent={<span>{this.props.confirmBtnTxt}</span>}
          />
        )
      }
    }
    const footerComponent = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          { renderCancelBtn() }
          { renderConfirmBtn() }
        </div>
      )
    }
    return (
      <div>
        <CustomModal show={this.state.showModal}
          bodyComponent={bodyComponent()}
          footerComponent={footerComponent()}
          close={this.props.close}
          backdrop
          width={window.innerWidth <= 768 ? null : '300px'}
          id={this.props.id}
        />
      </div>
    )
  }
}

MessageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  cancelBtnTxt: PropTypes.string,
  confirmBtnTxt: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  close: PropTypes.func,
  process: PropTypes.bool,
  id: PropTypes.string.isRequired
}

export default MessageModal
