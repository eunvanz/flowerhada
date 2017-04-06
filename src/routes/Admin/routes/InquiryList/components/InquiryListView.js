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
    this._handleOnClickAnswer = this._handleOnClickAnswer.bind(this)
    this._handleOnClickEditAnswer = this._handleOnClickEditAnswer.bind(this)
    this._handleOnClickViewAnswer = this._handleOnClickViewAnswer.bind(this)
  }
  componentDidMount () {
    this.props.fetchAllInquiries(0, 10) // 현재페이지, 페이지당 개수
    .then(() => {
      this.setState({ inquiries: this.props.inquiries.content })
    })
    .then(() => {
      this._initialize()
    })
  }
  _initialize () {
    this.setState({
      initialized: true
    })
  }
  _handleOnClickMoreList () {
    this.setState({ curPage: this.state.curPage + 1, isLoading: true })
    this.props.appendAllInquiries(this.state.curPage + 1, this.state.perPage)
    .then(() => {
      this.setState({ isLoading: false })
      this.setState({ inquiries: this.props.inquiries.content })
    })
  }
  _handleOnClickTitle (id) {
    console.log(this.state.showQuestion[id])
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
  _handleOnClickAnswer (parentId) {
    const inquiryModal = {
      mode: 'post',
      defaultCategory: '기타',
      inquiry: { parentId },
      afterSubmit: () => {
        const messageModal = {
          show: true,
          message: '답변이 저장되었습니다.',
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
  _handleOnClickEditAnswer (inquiry) {
    const inquiryModal = {
      mode: 'put',
      defaultCategory: '기타',
      inquiry: inquiry,
      afterSubmit: () => {
        const messageModal = {
          show: true,
          message: '답변이 수정되었습니다.',
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
    const { inquiries } = this.state
    const renderStatus = inquiry => {
      if (inquiry.answers.length === 0) {
        return <a onClick={() => this._handleOnClickAnswer(inquiry.id)}
          className='text-defalut' style={{ cursor: 'pointer' }}>답변하기</a>
      } else {
        return <a onClick={() => this._handleOnClickViewAnswer(inquiry.id)}
          className='text-defalut' style={{ cursor: 'pointer' }}>답변보기</a>
      }
    }
    const renderInquiries = () => {
      const returnComponent = []
      if (inquiries.length === 0) {
        return (
          <tr>
            <td colSpan={4} className='text-center' style={{ height: '200px' }}>문의 내역이 없습니다.</td>
          </tr>
        )
      }
      inquiries.forEach(inquiry => {
        returnComponent.push(
          <tr key={keygen._()}>
            <td className='text-center'>{convertSqlDateToStringDateOnly(inquiry.updateDate)}</td>
            <td><a onClick={() => this._handleOnClickTitle(inquiry.id)}
              style={{ cursor: 'pointer' }}>{inquiry.title}</a></td>
            <td className='text-center'>{inquiry.user ? inquiry.user.name : '비회원'}</td>
            <td className='text-center'>{renderStatus(inquiry)}</td>
          </tr>
        )
        returnComponent.push(
          <tr key={keygen._()} id={`question-${inquiry.id}`}
            style={{ display: this.state.showQuestion[inquiry.id] ? 'table-row' : 'none' }}>
            <td className='text-center'>문의내용</td>
            <td colSpan={3}>
              <div dangerouslySetInnerHTML={{ __html: inquiry.content }}></div>
            </td>
          </tr>
        )
        if (inquiry.answers.length > 0) {
          returnComponent.push(
            <tr key={keygen._()} id={`answer-${inquiry.id}`}
              style={{ display: this.state.showAnswer[inquiry.id] ? 'table-row' : 'none' }}>
              <td className='text-center'>답변</td>
              <td colSpan={3}>
                <div dangerouslySetInnerHTML={{ __html: inquiry.answers[0].content }}></div>
                <Button
                  textComponent={<span>수정</span>} onClick={() => this._handleOnClickEditAnswer(inquiry.answers[0])} />
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
            <td colSpan={4}>
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
              <th className='text-center'>작성자</th>
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
        {renderContent()}
      </div>
    )
  }
}

InquiryListView.contextTypes = {
  router: PropTypes.object.isRequired
}

InquiryListView.propTypes = {
  fetchAllInquiries: PropTypes.func.isRequired,
  appendAllInquiries: PropTypes.func.isRequired,
  inquiries: PropTypes.object.isRequired,
  setInquiryModal: PropTypes.func.isRequired,
  setInquiryModalShow: PropTypes.func.isRequired,
  setMessageModal: PropTypes.func.isRequired,
  setMessageModalShow: PropTypes.func.isRequired
}

export default InquiryListView
