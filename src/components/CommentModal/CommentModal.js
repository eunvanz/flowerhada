import React from 'react'
import CustomModal from 'components/CustomModal'
import TextField from 'components/TextField'
import { postCommentImage, postComment, putComment } from 'common/CommentService'
import Button from 'components/Button'

class CommentModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.comment ? this.props.comment.title : '',
      content: this.props.comment ? this.props.comment.content.replace(/<br>/g, '\r\n') : '',
      image: this.props.comment ? this.props.comment.image : '',
      mode: this.props.comment ? 'put' : 'post',
      process: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
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
  _handleOnClickSubmit () {
    this.setState({ process: true })
    const imageInput = document.getElementById('image')
    const file = imageInput.files[0]
    const finalizeSubmit = () => {
      this.props.close()
      this.props.afterSubmit()
      this.setState({
        title: '',
        content: '',
        image: '',
        process: false
      })
    }
    const doActionComment = () => {
      const data = new URLSearchParams()
      data.append('title', this.state.title)
      data.append('content', this.state.content.replace(/\n/g, '<br>'))
      data.append('type', this.props.type)
      data.append('image', this.state.image)
      data.append('groupName', this.props.groupName)
      data.append('userId', this.props.userId)
      if (this.props.parentId || (this.props.comment && this.props.comment.parentId)) {
        data.append('parentId', this.props.parentId || this.props.comment.parentId)
      }
      return this.state.mode === 'post' ? postComment(data) : putComment(data, this.props.comment.id)
    }
    if (file) {
      postCommentImage(file)
      .then(res => {
        const imgUrl = res.data.data.link
        this.setState({ image: imgUrl })
        doActionComment()
      })
      .then(() => {
        finalizeSubmit()
      })
    } else {
      doActionComment()
      .then(() => {
        finalizeSubmit()
      })
    }
  }
  render () {
    const renderBody = () => {
      return (
        <div className='row'>
          <div className='col-md-12'>
            <form role='form'>
              <TextField
                id='title'
                label='제목'
                onChange={this._handleOnChangeInput}
                value={this.state.title}
                limit={30}
                length={this.state.title.length}
                data-limit={30}
              />
              <label>내용</label>
              <textarea id='content' className='form-control' rows='8'
                value={this.state.content} onChange={this._handleOnChangeInput}
                data-limit={1000} />
              <div className='text-right small'>
                (<span className='text-default'>{this.state.content.length}</span>/1000)
              </div>
              <p />
              <label>이미지첨부</label>
              <input type='file' id='image' accept='image/*' />
            </form>
          </div>
        </div>
      )
    }
    const renderFooter = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          <Button className='margin-clear' color='dark' onClick={this.props.close} textComponent={<span>취소</span>} />
          <Button className='margin-clear'
            onClick={this.state.process ? null : this._handleOnClickSubmit}
            animated
            process={this.state.process}
            textComponent={<span>작성완료 <i className='fa fa-check' /></span>} />
        </div>
      )
    }
    return (
      <CustomModal
        title={`${this.props.type === 'review' ? '후기작성' : '문의하기'}`}
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

CommentModal.propTypes = {
  comment: React.PropTypes.object,
  type: React.PropTypes.string,
  show: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
  groupName: React.PropTypes.string,
  userId: React.PropTypes.number,
  afterSubmit: React.PropTypes.func.isRequired,
  parentId: React.PropTypes.number,
  id: React.PropTypes.string.isRequired
}

export default CommentModal
