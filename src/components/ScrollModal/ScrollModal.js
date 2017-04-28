import React, { PropTypes } from 'react'
import CustomModal from 'components/CustomModal'
import Button from 'components/Button'

class ScrollModal extends React.Component {
  render () {
    const renderBody = () => {
      const { innerHeight } = window
      return (
        <div
          style={{
            height: innerHeight - 250 > 500 ? '500px' : `${innerHeight - 250}px`,
            overflow: 'auto'
          }}
        >
          {this.props.bodyComponent}
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          <Button className='margin-clear'
            color='dark'
            textComponent={<span>닫기</span>}
            onClick={this.props.close}
          />
        </div>
      )
    }
    return (
      <CustomModal
        title={this.props.title}
        width='600px'
        backdrop
        show={this.props.show}
        close={this.props.close}
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        id={this.props.id}
      />
    )
  }
}

ScrollModal.propTypes = {
  title: PropTypes.string.isRequired,
  bodyComponent: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}

export default ScrollModal
