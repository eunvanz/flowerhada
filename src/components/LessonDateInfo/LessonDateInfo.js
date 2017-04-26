import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { convertDateToString, extractDaysFromLessonDays } from 'common/util'
import { setMessageModalShow, setMessageModal } from 'store/messageModal'
import { setInquiryModal } from 'store/inquiry'

const mapDispatchToProps = {
  setMessageModalShow,
  setMessageModal,
  setInquiryModal
}

const mapStateToProps = (state) => ({
  user: state.user
})

class LessonDateInfo extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickReOpen = this._handleOnClickReOpen.bind(this)
  }
  _handleOnClickReOpen () {
    const inquiryModal = {
      mode: 'post',
      defaultCategory: '레슨재개설신청',
      inquiry: {
        title: '레슨을 다시 개설해주세요.',
        content:
`희망 레슨 : ${this.props.lesson.title}
희망 지역 :
희망일 :
희망 인원 :
신청자이름 : ${this.props.user ? this.props.user.name : ''}
연락처 : ${this.props.user ? this.props.user.phone : ''}`
      },
      afterSubmit: () => {
        const messageModal = {
          show: true,
          message: '문의가 완료되었습니다. 빠른 시일내에 답변드리겠습니다.',
          cancelBtnTxt: null,
          confirmBtnTxt: '확인',
          onConfirmClick: () => this.props.setMessageModalShow(false),
          process: false
        }
        this.props.setMessageModal(messageModal)
      },
      show: true,
      process: false
    }
    this.props.setInquiryModal(inquiryModal)
  }
  render () {
    const lesson = this.props.lesson
    if (lesson.expired) {
      return (
        <span>
          지난레슨 <a onClick={this._handleOnClickReOpen} style={{ cursor: 'pointer' }}>재개설 신청하기</a>
        </span>
      )
    } else if (lesson.oneday) {
      return (
        <span className='text-muted'>오는 <strong>{convertDateToString(lesson.lessonDate)}</strong>에 진행되는 <strong>원데이레슨</strong></span>
      )
    } else {
      return (
        <span className='text-muted'>
          오는 <strong>{convertDateToString(lesson.lessonDate)}</strong>부터 <strong>{`${lesson.weekType} ${extractDaysFromLessonDays(lesson.lessonDays)}요일`}</strong>에 <strong>{lesson.weekLong}주간</strong> 진행
        </span>
      )
    }
  }
}

LessonDateInfo.propTypes = {
  lesson: PropTypes.object.isRequired,
  user: PropTypes.object,
  setMessageModalShow: PropTypes.func.isRequired,
  setMessageModal: PropTypes.func.isRequired,
  setInquiryModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonDateInfo)
