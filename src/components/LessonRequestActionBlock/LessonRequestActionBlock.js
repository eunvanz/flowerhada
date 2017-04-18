import React from 'react'
import ActionBlock from 'components/ActionBlock'
import { connect } from 'react-redux'
import { setMessageModalShow, setMessageModal } from 'store/messageModal'
import { setInquiryModal } from 'store/inquiry'

const mapDispatchToProps = {
  setMessageModal,
  setMessageModalShow,
  setInquiryModal
}

const mapStateToProps = state => ({
  user: state.user
})

class LessonRequestActionBlock extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickRequestLesson = this._handleOnClickRequestLesson.bind(this)
  }
  _handleOnClickRequestLesson () {
    const inquiryModal = {
      inquiry: { title: '출장레슨을 신청합니다.' },
      show: true,
      process: false,
      defaultCategory: '출장레슨신청',
      afterSubmit: () => {
        let message = this.props.user ? '문의가 완료되었습니다. 문의 내역은 "마이페이지"에서도 확인하실 수 있습니다.' : '문의가 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.' // eslint-disable-line
        const messageModal = {
          show: true,
          message,
          cancelBtnTxt: null,
          confirmBtnTxt: '확인',
          onConfirmClick: () => {
            this.props.setMessageModalShow(false)
          },
          process: false
        }
        this.props.setMessageModal(messageModal)
      },
      mode: 'post'
    }
    this.props.setInquiryModal(inquiryModal)
  }
  render () {
    return (
      <ActionBlock
        title='우리동네로 call hada'
        desc='내게 맞는 레슨이 없다고 좌절하지 마세요. 여러분이 원하는 지역과 시간대로 레슨을 개설해드립니다.'
        onClick={this._handleOnClickRequestLesson}
        btnTxt='출장레슨 신청'
        btnIcon='fa fa-pencil-square-o pl-20'
      />
    )
  }
}

LessonRequestActionBlock.propTypes = {
  setMessageModalShow: React.PropTypes.func.isRequired,
  setMessageModal: React.PropTypes.func.isRequired,
  setInquiryModal: React.PropTypes.func.isRequired,
  user: React.PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonRequestActionBlock)
