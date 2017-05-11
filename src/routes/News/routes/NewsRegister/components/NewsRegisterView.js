import React, { PropTypes } from 'react'
import TextField from 'components/TextField'
import Button from 'components/Button'
import { Link } from 'react-router'
import $ from 'jquery'
import { setInlineScripts, clearInlineScripts } from 'common/util'
import { postBoard, putBoard, deleteBoardById } from 'common/BoardService'

class NewsRegisterView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      mode: props.params.id === 'new' ? 'register' : 'update',
      process: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
  }
  componentDidMount () {
    if (!this.props.isAdmin) {
      this.context.router.push('/not-found')
      return
    }
    if (this.state.mode === 'update') {
      this.props.fetchBoard(this.props.params.id)
      .then(() => {
        this.setState({
          title: this.props.news.title,
          content: this.props.news.content
        })
        $('#content').val(this.state.content)
        const scripts = ['//cdn.tinymce.com/4/tinymce.min.js',
          '/template/js/inline-lesson-register-view.js']
        setInlineScripts(scripts)
      })
    } else {
      const scripts = ['//cdn.tinymce.com/4/tinymce.min.js',
        '/template/js/inline-lesson-register-view.js']
      setInlineScripts(scripts)
    }
  }
  componentWillUnmount () {
    this.props.unselectBoard()
    clearInlineScripts()
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    this.setState({ [e.target.id]: e.target.value })
  }
  _handleOnClickSubmit (e) {
    e.preventDefault()
    this.setState({ process: true })
    const content = window.tinymce.get('content').getContent()
    let news = {
      title: this.state.title,
      content,
      category: 'news',
      userId: this.props.user.id
    }
    if (this.state.mode === 'update') {
      news = Object.assign({}, this.props.news, news)
      news.regDate = null
      news.updateDate = null
    }
    const action = this.state.mode === 'register' ? () => postBoard(news) : () => putBoard(news)
    action()
    .then(() => {
      this.context.router.push('/news')
    })
  }
  _handleOnClickDelete () {
    this.setState({ process: true })
    deleteBoardById(this.props.params.id)
    .then(() => {
      this.context.router.push('/news')
    })
  }
  render () {
    return (
      <div>
        <form role='form'>
          <TextField
            id='title'
            label='제목'
            onChange={this._handleOnChangeInput}
            value={this.state.title}
          />
          <label htmlFor='content'>내용</label>
          <textarea id='content' defaultValue={this.state.content} />
          <Button onClick={this._handleOnClickSubmit} process={this.state.process} style={{ marginRight: '3px' }}
            textComponent={<span>{this.state.mode !== 'register' ? '수정' : '등록'}</span>} />
          {this.state.mode === 'update' &&
            <button type='button' className='btn btn-grey' style={{ marginRight: '3px' }}
              onClick={this._handleOnClickDelete}>삭제</button>}
          <Link to='/news'>
            <button type='button' className='btn btn-default'>목록</button>
          </Link>
        </form>
      </div>
    )
  }
}

NewsRegisterView.contextTypes = {
  router: PropTypes.object.isRequired
}

NewsRegisterView.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  params: PropTypes.object,
  fetchBoard: PropTypes.func.isRequired,
  unselectBoard: PropTypes.func.isRequired,
  news: PropTypes.object,
  user: PropTypes.object.isRequired
}

export default NewsRegisterView
