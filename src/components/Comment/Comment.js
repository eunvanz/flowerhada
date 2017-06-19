import React, { PropTypes } from 'react'
import { shortenContent, convertSqlDateToString } from 'common/util'
import CommentModal from 'components/CommentModal'
import keygen from 'keygenerator'
import Button from 'components/Button'
import MessageModal from 'components/MessageModal'
import { deleteComment } from 'common/CommentService'
import { postPointHistory } from 'common/PointHistoryService'

class Comment extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMore: false,
      showEditModal: false,
      showReplyModal: false,
      showReplies: false,
      showMessageModal: false,
      deleteProcess: false
    }
    this._handleOnClickMore = this._handleOnClickMore.bind(this)
    this._createMarkup = this._createMarkup.bind(this)
    this._handleOnClickReply = this._handleOnClickReply.bind(this)
    this._handleOnClickCloseEditModal = this._handleOnClickCloseEditModal.bind(this)
    this._handleOnClickReplyView = this._handleOnClickReplyView.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._handleOnClickCloseMessageModal = this._handleOnClickCloseMessageModal.bind(this)
    this._handleOnClickConfirm = this._handleOnClickConfirm.bind(this)
    this._handleOnClickEdit = this._handleOnClickEdit.bind(this)
    this._handleOnClickCloseReplyModal = this._handleOnClickCloseReplyModal.bind(this)
  }
  _handleOnClickMore (e) {
    e.preventDefault()
    const content = document.getElementById(`#contentView${this.props.item.id}`)
    if (this.state.showMore) {
      content.innerHTML = shortenContent(this.props.item.content, 80)
    } else {
      content.innerHTML = this.props.item.content
    }
    this.setState({ showMore: !this.state.showMore })
  }
  _createMarkup () {
    const content = this.props.item.content
    let markup = content
    if (!this.state.showMore) {
      markup = shortenContent(content, 80)
      if (this.props.item.image !== '' && markup.length < 83) {
        markup += ' ...'
      }
    }
    return { __html: markup }
  }
  _handleOnClickReply () {
    this.setState({ showReplyModal: true })
  }
  _handleOnClickEdit () {
    this.setState({ showEditModal: true })
  }
  _handleOnClickCloseEditModal () {
    this.setState({ showEditModal: false })
  }
  _handleOnClickCloseReplyModal () {
    this.setState({ showReplyModal: false })
  }
  _handleOnClickReplyView () {
    this.setState({ showReplies: !this.state.showReplies })
  }
  _handleOnClickCloseMessageModal () {
    this.setState({ showMessageModal: false })
  }
  _handleOnClickDelete () {
    this.setState({ showMessageModal: true })
  }
  _handleOnClickConfirm () {
    const { item, point, imagePoint } = this.props
    this.setState({ deleteProcess: true })
    deleteComment(this.props.item.id)
    .then(() => {
      const promArr = []
      if (point) {
        promArr.push(() => postPointHistory({
          userId: item.userId,
          amount: point * -1,
          action: '리뷰 삭제'
        }))
        if (item.image && item.image !== '') {
          promArr.push(() => postPointHistory({
            userId: item.userId,
            amount: imagePoint * -1,
            action: '리뷰 이미지 삭제'
          }))
        }
        return promArr.reduce((cur, next) => {
          return cur.then(next)
        }, Promise.resolve())
      }
      return Promise.resolve()
    })
    .then(() => {
      this.props.afterDelete()
    })
  }
  render () {
    const item = this.props.item
    const isLongContent = item.image !== '' || item.content.length > 80 || item.content.indexOf('<br>') > -1
    const renderMoreButton = () => {
      if (isLongContent) {
        return (
          <a href='' className='btn-md-link link-default pull-right' onClick={this._handleOnClickMore}>
            {
              !this.state.showMore
              ? <span><i className='fa fa-caret-down' /> 펼쳐보기</span>
              : <span><i className='fa fa-caret-up' /> 접기</span>
            }
          </a>
        )
      }
    }
    const renderReplyButton = () => {
      const isEditButtonRendered = this.props.userId === this.props.item.userId
      if (this.props.isAdmin) {
        return (
          <a className='btn-md-link link-dark pull-right' onClick={this._handleOnClickReply}
            style={{ cursor: 'pointer' }}>
            <i className='fa fa-reply' />
          </a>
        )
      } else if (isLongContent || isEditButtonRendered) {
        return null
      }
      return <div style={{ height: '30px' }}></div> // eslint-disable-line
    }
    const renderReplies = () => {
      let returnComponent = null
      if (this.state.showReplies && this.props.item.replies) {
        returnComponent = this.props.item.replies.map(reply => {
          return <Comment item={reply} key={keygen._()} userId={this.props.userId} isAdmin={this.props.isAdmin}
            afterDelete={this.props.afterDelete} afterSubmit={this.props.afterSubmit} />
        })
      }
      return returnComponent
    }
    const renderReplyViewButton = () => {
      if (this.props.item.replies && this.props.item.replies.length > 0) {
        return <a className='btn-md-link link-default pull-right' onClick={this._handleOnClickReplyView}
          style={{ cursor: 'pointer' }}>
          {
            !this.state.showReplies
            ? <span><i className='fa fa-caret-down' /> {this.props.item.replies.length}개의 댓글</span>
            : <span><i className='fa fa-caret-up' /> 댓글접기</span>
          }
        </a>
      }
    }
    const renderEditButtons = () => {
      if (this.props.userId === this.props.item.userId) {
        return (
          <span>
            <Button link style={{ cursor: 'pointer' }}
              onClick={this._handleOnClickDelete}
              className='pull-right'
              color='dark'
              textComponent={<i className='fa fa-trash' />}
            />
            <Button link style={{ cursor: 'pointer' }}
              onClick={this._handleOnClickEdit}
              className='pull-right'
              color='dark'
              textComponent={<i className='fa fa-pencil-square-o' />}
            />
          </span>
        )
      }
    }
    return (
      <div className='comment clearfix'>
        <div className='comment-avatar'>
          <img
            className='img-circle'
            src={`${item.user.image}`}
            alt='avatar'
            style={{ width: '50px', height: '50px' }}
          />
        </div>
        <header>
          <h4 style={{ marginTop: '3px' }}>{item.title}</h4>
          <div className='comment-meta'>작성자 {item.user.name} | {convertSqlDateToString(item.regDate)}</div>
        </header>
        <div className='comment-content'>
          <div className='comment-body clearfix'>
            <div id={`#contentView${this.props.item.id}`} dangerouslySetInnerHTML={this._createMarkup()} />
            {
              item.image !== '' &&
              <p id='imageView' style={this.state.showMore ? { display: 'block' } : { display: 'none' }}>
                <img src={item.image} />
              </p>
            }
            { renderReplyViewButton() }
            { renderMoreButton() }
            { renderReplyButton() }
            { renderEditButtons() }
            <CommentModal
              comment={this.props.item}
              type={this.props.item.type}
              show={this.state.showEditModal}
              close={this._handleOnClickCloseEditModal}
              groupName={this.props.item.groupName}
              afterSubmit={this.props.afterSubmit}
              userId={this.props.userId}
              id={`editModal${keygen._()}`}
              validator={() => Promise.resolve()}
            />
            <CommentModal
              type={this.props.item.type}
              show={this.state.showReplyModal}
              close={this._handleOnClickCloseReplyModal}
              parentId={this.props.item.id}
              afterSubmit={this.props.afterSubmit}
              userId={this.props.userId}
              id={`replyModal${keygen._()}`}
              validator={() => Promise.resolve()}
            />
            <MessageModal
              show={this.state.showMessageModal}
              message={this.props.item.type === 'review' ? '리뷰 등록으로 얻은 포인트 또한 차감됩니다. 정말 삭제하시겠습니까?' : '정말 삭제하시겠습니까?'}
              cancelBtnTxt='아니오'
              confirmBtnTxt='예'
              onConfirmClick={this._handleOnClickConfirm}
              close={this._handleOnClickCloseMessageModal}
              process={this.state.deleteProcess}
              id={`messageModal${keygen._()}`}
            />
          </div>
        </div>
        { renderReplies() }
      </div>
    )
  }
}

Comment.propTypes = {
  item: PropTypes.object.isRequired,
  userId: PropTypes.number,
  afterSubmit: PropTypes.func,
  afterDelete: PropTypes.func,
  point: PropTypes.number,
  imagePoint: PropTypes.number,
  isAdmin: PropTypes.bool
}

export default Comment
