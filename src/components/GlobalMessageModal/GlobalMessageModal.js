import React from 'react'
import MessageModal from 'components/MessageModal'
import { connect } from 'react-redux'
import { setMessageModalShow } from 'store/messageModal'

const mapDispatchToProps = {
  setMessageModalShow
}

const mapStateToProps = state => ({
  ...state.messageModal
})

class GlobalMessageModal extends React.Component {
  render () {
    return (
      <MessageModal
        show={this.props.show}
        message={this.props.message}
        cancelBtnTxt={this.props.cancelBtnTxt}
        confirmBtnTxt={this.props.confirmBtnTxt}
        onConfirmClick={this.props.onConfirmClick}
        id='globalMessageModal'
        process={this.props.process}
        close={() => setMessageModalShow(false)}
      />
    )
  }
}

GlobalMessageModal.propTypes = {
  message: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired,
  cancelBtnTxt: React.PropTypes.string,
  confirmBtnTxt: React.PropTypes.string.isRequired,
  onConfirmClick: React.PropTypes.func.isRequired,
  process: React.PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalMessageModal)
