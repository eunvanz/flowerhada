import React from 'react'
import CustomModal from 'components/CustomModal'
import TextField from 'components/TextField'
import { postCommentImage, postComment, putComment } from 'common/CommentService'
import { postPointHistory } from 'common/PointHistoryService'
import Button from 'components/Button'
import { Tooltip } from 'react-bootstrap'
import numeral from 'numeral'

class CommentModal extends React.Component {
  constructor (props) {
    super(props)
    let validImagePoint = false
    if (!this.props.comment) {
      validImagePoint = true
    } else if (this.props.comment && this.props.comment.image === '') {
      validImagePoint = true
    }
    this.state = {
      title: this.props.comment ? this.props.comment.title : '',
      content: this.props.comment ? this.props.comment.content.replace(/<br>/g, '\r\n') : '',
      image: this.props.comment ? this.props.comment.image : '',
      mode: this.props.comment ? 'put' : 'post',
      process: false,
      validImagePoint
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
      this.setState({
        title: '',
        content: '',
        image: '',
        process: false
      })
      this.props.close()
      this.props.afterSubmit()
    }
    const doActionComment = () => {
      const comment = {
        title: this.state.title,
        content: this.state.content.replace(/\n/g, '<br>'),
        type: this.props.type,
        image: this.state.image,
        groupName: this.props.groupName,
        userId: this.props.userId
      }
      if (this.props.parentId || (this.props.comment && this.props.comment.parentId)) {
        comment.parentId = this.props.parentId || this.props.comment.parentId
      }
      return this.state.mode === 'post' ? postComment(comment) : putComment(comment, this.props.comment.id)
    }
    const handlePoint = () => {
      if (this.state.mode === 'post') {
        const pointHistory = {
          userId: this.props.userId,
          amount: this.props.point,
          action: '리뷰 작성'
        }
        return postPointHistory(pointHistory)
      } else {
        return Promise.resolve()
      }
    }
    const handleImagePoint = () => {
      if (this.state.validImagePoint) {
        const pointHistory = {
          userId: this.props.userId,
          amount: this.props.imagePoint,
          action: '리뷰에 이미지 업로드'
        }
        return postPointHistory(pointHistory)
      } else {
        Promise.resolve()
      }
    }
    const validate = () => {
      return this.props.type === 'review' && this.state.mode === 'post' ? this.props.validator() : Promise.resolve()
    }
    validate()
    .then(() => {
      if (file) {
        return postCommentImage(file)
        .then(res => {
          const imgUrl = res.data.data.link
          this.setState({ image: imgUrl })
          return doActionComment()
        })
        .then(() => {
          if (this.state.mode === 'post' && this.props.type === 'review') return handlePoint()
          else return Promise.resolve()
        })
        .then(() => {
          if (this.state.mode === 'post' && this.props.type === 'review' && this.props.imagePoint) return handleImagePoint()
          else return Promise.resolve()
        })
        .then(() => {
          return finalizeSubmit()
        })
      } else {
        return doActionComment()
        .then(() => {
          if (this.props.type === 'review') return handlePoint()
          else return Promise.resolve()
        })
        .then(() => {
          return finalizeSubmit()
        })
      }
    })
    .catch(() => {
      this.setState({ process: false })
      alert('레슨 수강완료 혹은 상품 배송완료 후에 작성 가능합니다.')
    })
  }
  render () {
    const renderImageTooltip = () => {
      if (this.props.type === 'review' && this.props.imagePoint) {
        return (
          <Tooltip placement='right' className='in' id='imagePointInfo' style={{ display: 'inline' }}>
            <span className='text-default'>+{numeral(this.props.imagePoint).format('0,0')}P</span> 추가적립
          </Tooltip>
        )
      }
    }
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
                placeholder='제목을 입력해주세요.'
              />
              <label>내용</label>
              <textarea id='content' className='form-control' rows='8' placeholder='내용을 입력해주세요.'
                value={this.state.content} onChange={this._handleOnChangeInput}
                data-limit={1000} />
              <div className='text-right small'>
                (<span className='text-default'>{this.state.content.length}</span>/1000)
              </div>
              <p />
              <label>이미지첨부
                {renderImageTooltip()}
              </label>
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
          {this.state.title !== '' && this.state.content !== '' &&
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
  type: React.PropTypes.string, // 'review' 혹은 'inquiry'
  show: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
  groupName: React.PropTypes.string,
  userId: React.PropTypes.number,
  afterSubmit: React.PropTypes.func.isRequired,
  parentId: React.PropTypes.number,
  id: React.PropTypes.string.isRequired,
  imagePoint: React.PropTypes.number,
  point: React.PropTypes.number,
  validator: React.PropTypes.func
}

export default CommentModal
