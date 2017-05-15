import React from 'react'
import CustomModal from 'components/CustomModal'
import TextField from 'components/TextField'
import { postInquiry, putInquiry } from 'common/InquiryService'
import Button from 'components/Button'
import { connect } from 'react-redux'
import { setInquiryModalShow, setInquiryModalProcess } from 'store/inquiry'

const mapDispatchToProps = {
  setInquiryModalShow,
  setInquiryModalProcess
}

const mapStateToProps = state => ({
  ...state.inquiry.inquiryModal,
  user: state.user
})

class InquiryModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      category: '분류선택', // 출장레슨신청, 레슨재개설신청, 기타
      content: '분류를 먼저 선택해주세요.'
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnChangeCategory = this._handleOnChangeCategory.bind(this)
    this._setContentAlongCategory = this._setContentAlongCategory.bind(this)
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.inquiry !== this.props.inquiry) {
      const title = nextProps.inquiry.title ? nextProps.inquiry.title : ''
      const category = nextProps.inquiry.category ? nextProps.inquiry.category : nextProps.defaultCategory
      const content = nextProps.inquiry.content ? nextProps.inquiry.content : ''
      this.setState({
        title,
        category,
        content
      })
      if (content === '') {
        this._setContentAlongCategory(category)
      }
    } else if (nextProps.show && !this.props.show) {
      this.setState({ category: nextProps.defaultCategory })
      this._setContentAlongCategory(nextProps.defaultCategory)
    }
  }
  _handleOnChangeInput (e) {
    const value = e.target.value
    const id = e.target.id
    const limit = e.target.dataset.limit
    if (limit && limit < value.length) {
      return
    }
    this.setState({
      [id]: value
    })
  }
  _handleOnChangeCategory (e) {
    const category = e.target.value
    this._setContentAlongCategory(category)
    this.setState({ category })
  }
  _setContentAlongCategory (category) {
    let content = '분류를 먼저 선택해주세요.'
    let title = ''
    if (category === '출장레슨신청') {
      title = '출장레슨을 신청합니다.'
      content = `희망 레슨 : \n희망 지역 : \n희망일 : \n희망 인원 : \n신청자이름 : ${this.props.user ? this.props.user.name : ''}\n연락처 : ${this.props.user ? (this.props.user.phone ? this.props.user.phone : '') : ''}`
    } else if (category === '레슨재개설신청') {
      title = '레슨을 다시 개설해주세요.'
      content = `희망 레슨 : \n희망 지역 : \n희망일 : \n희망 인원 : \n신청자이름 : ${this.props.user ? this.props.user.name : ''}\n연락처 : ${this.props.user ? (this.props.user.phone ? this.props.user.phone : '') : ''}`
    } else if (category === '기타') {
      content = `문의 내용 : \n이름 : ${this.props.user ? this.props.user.name : ''}\n연락처 : ${this.props.user ? (this.props.user.phone ? this.props.user.phone : '') : ''}`
    }
    this.setState({ title, content })
  }
  _handleOnClickSubmit () {
    this.props.setInquiryModalProcess(true)
    const finalizeSubmit = () => {
      this.setState({
        title: '',
        category: '출장레슨신청',
        content: '',
        process: false
      })
      this.props.setInquiryModalProcess(false)
      this.props.setInquiryModalShow(false)
      this.props.afterSubmit()
    }
    const doActionComment = () => {
      const inquiry = {
        title: this.state.title,
        category: this.state.category,
        content: this.state.content.replace(/\n/g, '<br>'),
        userId: this.props.user ? this.props.user.id : null,
        parentId: this.props.inquiry.parentId
      }
      return this.props.mode === 'post' ? postInquiry(inquiry) : putInquiry(inquiry, this.props.inquiry.id)
    }
    doActionComment()
    .then(() => {
      finalizeSubmit()
    })
  }
  render () {
    const renderBody = () => {
      return (
        <div className='row'>
          <div className='col-md-12'>
            <form role='form'>
              <label>분류</label>
              <select className='form-control' id='category'
                onChange={this._handleOnChangeCategory} value={this.state.category}>
                <option value='분류선택' disabled>분류선택</option>
                <option value='출장레슨신청'>출장레슨신청</option>
                <option value='레슨재개설신청'>레슨재개설신청</option>
                <option value='기타'>기타</option>
              </select>
              <p />
              <TextField
                placeholder='제목을 입력해주세요.'
                id='title'
                label='제목'
                onChange={this._handleOnChangeInput}
                value={this.state.title}
                limit={30}
                length={this.state.title.length}
                data-limit={30}
                disabled={this.state.category === '분류선택'}
              />
              <label>내용</label>
              <textarea id='content' className='form-control' rows='8'
                value={this.state.content} onChange={this._handleOnChangeInput}
                data-limit={1000} disabled={this.state.category === '분류선택'} />
              <div className='text-right small'>
                (<span className='text-default'>{this.state.content.length}</span>/1000)
              </div>
            </form>
          </div>
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          <Button className='margin-clear' color='dark' onClick={() => this.props.setInquiryModalShow(false)}
            textComponent={<span>취소</span>} />
          { this.state.category !== '분류선택' && this.state.title.length > 0 && this.state.content.length > 0 &&
          <Button className='margin-clear'
            onClick={this.state.process ? null : this._handleOnClickSubmit}
            animated
            process={this.state.process}
            textComponent={<span>작성완료 <i className='fa fa-check' /></span>} />}
        </div>
      )
    }
    return (
      <CustomModal
        title='1:1문의'
        width='600px'
        backdrop
        show={this.props.show}
        close={() => this.props.setInquiryModalShow(false)}
        bodyComponent={renderBody()}
        footerComponent={renderFooter()}
        id='globalInquiryModal'
      />
    )
  }
}

InquiryModal.propTypes = {
  inquiry: React.PropTypes.object,
  mode: React.PropTypes.string,
  show: React.PropTypes.bool.isRequired,
  userId: React.PropTypes.number,
  afterSubmit: React.PropTypes.func.isRequired,
  defaultCategory: React.PropTypes.string,
  process: React.PropTypes.bool.isRequired,
  setInquiryModalShow: React.PropTypes.func.isRequired,
  setInquiryModalProcess: React.PropTypes.func.isRequired,
  user: React.PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(InquiryModal)
