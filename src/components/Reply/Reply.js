import React, { PropTypes } from 'react'
import { imgRoute } from 'common/constants'
import { shortenContent, maskName, convertSqlDateToString } from 'common/util'

class Reply extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMore: false
    }
    this._handleOnClickMore = this._handleOnClickMore.bind(this)
    this._createMarkup = this._createMarkup.bind(this)
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
      return <div style={{ height: '30px' }}></div> // eslint-disable-line
    }
    return (
      <div className='comment clearfix'>
        <div className='comment-avatar'>
          <img
            className='img-circle'
            src={`${imgRoute}/${item.user.image}`}
            alt='avatar'
            style={{ width: '50px', height: '50px' }}
          />
        </div>
        <header>
          <h3>{item.title}</h3>
          <div className='comment-meta'>작성자 {maskName(item.user.name)} | {convertSqlDateToString(item.regDate)}</div>
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
            { renderReplyButton() }
            { renderMoreButton() }
          </div>
        </div>
      </div>
    )
  }
}

Reply.propTypes = {
  item: PropTypes.object.isRequired
}

export default Reply
