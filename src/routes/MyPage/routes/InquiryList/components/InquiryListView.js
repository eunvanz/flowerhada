import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import keygen from 'keygenerator'
import { convertSqlDateToStringDateOnly } from 'common/util'
import Button from 'components/Button'

class InquiryListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inquiries: [],
      curPage: 0,
      perPage: 10,
      isLoading: false,
      initialized: false,
      cancelProcess: false,
      showQuestion: {},
      showAnswer: {}
    }
    this._initialize = this._initialize.bind(this)
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
    this._handleOnClickTitle = this._handleOnClickTitle.bind(this)
    this._handleOnClickViewAnswer = this._handleOnClickViewAnswer.bind(this)
    this._handleOnClickWrite = this._handleOnClickWrite.bind(this)
  }
  componentDidMount () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    } else {
      this.props.fetchInquiriesByUserId(this.props.user.id, 0, 10) // 현재페이지, 페이지당 개수
      .then(() => {
        this.setState({ inquiries: this.props.inquiries.content })
      })
      .then(() => {
        this._initialize()
      })
    }
  }
  _initialize () {
    this.setState({
      initialized: true
    })
  }
  _handleOnClickMoreList () {
    this.setState({ curPage: this.state.curPage + 1, isLoading: true })
    this.props.appendInquiriesByUserId(this.props.user.id, this.state.curPage + 1, this.state.perPage)
    .then(() => {
      this.setState({ isLoading: false })
      this.setState({ inquiries: this.props.inquiries.content })
    })
  }
  _handleOnClickTitle (id) {
    if (!this.state.showQuestion[id]) {
      this.setState({
        showQuestion: Object.assign({}, this.state.showQuestion, { [id]: true })
      })
    } else {
      this.setState({
        showQuestion: Object.assign({}, this.state.showQuestion, { [id]: false })
      })
    }
  }
  _handleOnClickViewAnswer (id) {
    if (!this.state.showAnswer[id]) {
      this.setState({
        showAnswer: Object.assign({}, this.state.showAnswer, { [id]: true })
      })
    } else {
      this.setState({
        showAnswer: Object.assign({}, this.state.showAnswer, { [id]: false })
      })
    }
  }
  _handleOnClickWrite () {
    const inquiryModal = {
      mode: 'post',
      defaultCategory: '분류선택',
      inquiry: {},
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
      show: true
    }
    this.props.setInquiryModal(inquiryModal)
  }
  render () {
    const { user } = this.props
    const { inquiries } = this.state
    if (!user) {
      this.context.router.push('/login')
      return null
    }
    const renderStatus = inquiry => {
      if (inquiry.answers.length === 0) {
        return '답변대기중'
      } else {
        return <a onClick={() => this._handleOnClickViewAnswer(inquiry.id)}
          className='text-defalut'
          style={{ cursor: 'pointer' }}>{this.state.showAnswer[inquiry.id] ? '답변접기' : '답변보기'}</a>
      }
    }
    const renderInquiries = () => {
      const returnComponent = []
      if (inquiries.length === 0) {
        return (
          <tr>
            <td colSpan={3} className='text-center' style={{ height: '200px' }}>문의 내역이 없습니다.</td>
          </tr>
        )
      }
      inquiries.forEach(inquiry => {
        returnComponent.push(
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(inquiry.updateDate)}</td>
            <td><a onClick={() => this._handleOnClickTitle(inquiry.id)}
              style={{ cursor: 'pointer' }}>{inquiry.title}</a></td>
            <td className='text-center'>{renderStatus(inquiry)}</td>
          </tr>
        )
        returnComponent.push(
          <tr key={keygen._()} id={`question-${inquiry.id}`}
            style={{ display: this.state.showQuestion[inquiry.id] ? 'table-row' : 'none' }}>
            <td className='text-center'><h5><strong>문의내용</strong></h5></td>
            <td colSpan={2}>
              <div dangerouslySetInnerHTML={{ __html: inquiry.content }}></div>
            </td>
          </tr>
        )
        if (inquiry.answers.length > 0) {
          returnComponent.push(
            <tr key={keygen._()} id={`answer-${inquiry.id}`}
              style={{ display: this.state.showAnswer[inquiry.id] ? 'table-row' : 'none' }}>
              <td className='text-center'><h5><strong>답변</strong></h5></td>
              <td colSpan={2}>
                <div dangerouslySetInnerHTML={{ __html: inquiry.answers[0].content }}></div>
              </td>
            </tr>
          )
        }
      })
      return returnComponent
    }
    const renderMoreButton = () => {
      if (!this.props.inquiries.last) {
        return (
          <tr>
            <td colSpan={3}>
              <Button
                className='btn-block'
                onClick={this._handleOnClickMoreList}
                process={this.state.isLoading}
                square
                color='gray'
                textComponent={
                  <span>
                    <i className='fa fa-angle-down' /> <span className='text-default'>
                      {this.props.inquiries.totalPages - 1 -
                      this.props.inquiries.number === 1 ? this.props.inquiries.totalElements -
                      (this.props.inquiries.number + 1) * this.props.inquiries.numberOfElements
                      : this.props.inquiries.numberOfElements}</span>건 더 보기
                  </span>
                }
              />
            </td>
          </tr>
        )
      }
    }
    const renderInquiryList = () => {
      return (
        <table className='table cart table-hover table-colored'>
          <thead>
            <tr>
              <th className='text-center' style={{ width: '150px' }}>문의일자</th>
              <th className='text-center'>제목</th>
              <th className='text-center' style={{ width: '150px' }}>답변</th>
            </tr>
          </thead>
          <tbody>
            {renderInquiries()}
            {renderMoreButton()}
          </tbody>
        </table>
      )
    }
    const renderContent = () => {
      let returnComponent = null
      if (!this.state.initialized) {
        returnComponent = <Loading text='정보를 불러오는 중..' />
      } else {
        returnComponent = (
          <div>
            {renderInquiryList()}
          </div>
        )
      }
      return returnComponent
    }
    return (
      <div>
        <div className='text-left'>
          <Button
            color='dark'
            animated
            textComponent={<span><i className='fa fa-pencil' /> 1:1 문의하기</span>}
            onClick={this._handleOnClickWrite}
          />
        </div>
        {renderContent()}
      </div>
    )
  }
}

InquiryListView.contextTypes = {
  router: PropTypes.object.isRequired
}

InquiryListView.propTypes = {
  fetchInquiriesByUserId: PropTypes.func.isRequired,
  appendInquiriesByUserId: PropTypes.func.isRequired,
  user: PropTypes.object,
  inquiries: PropTypes.object.isRequired,
  setInquiryModal: PropTypes.func.isRequired,
  setMessageModal: PropTypes.func.isRequired,
  setMessageModalShow: PropTypes.func.isRequired
}

export default InquiryListView
