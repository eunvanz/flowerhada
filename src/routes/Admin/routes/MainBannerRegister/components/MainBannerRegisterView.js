import React from 'react'
import $ from 'jquery'
import { postMainBanner, putMainBanner, deleteMainBanner } from 'common/MainBannerService'
import { Link } from 'react-router'
import { postLessonImage } from 'common/LessonService'
import Button from 'components/Button'

class MainBannerRegister extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'MainBannerRegister'
    this.state = {
      title: '',
      shortTitle: '',
      detail: '',
      link: '',
      activated: true,
      img: '',
      mode: this.props.params.id === 'register' ? 'register' : 'update'
    }
    this._handleOnChangeCheckbox = this._handleOnChangeCheckbox.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
  }
  componentDidMount () {
    if (this.state.activated) $('#activated').attr('checked', 'checked')
    if (this.state.mode === 'update') {
      this.props.fetchMainBanner(this.props.params.id)
      .then(() => {
        this.setState({
          title: this.props.banner.title,
          shortTitle: this.props.banner.shortTitle,
          detail: this.props.banner.detail,
          link: this.props.banner.link,
          activated: this.props.banner.activated,
          img: this.props.banner.img
        })
      })
    } else {
      this.props.clearMainBanner()
    }
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    this.setState({ [e.target.id]: e.target.value })
  }
  _handleOnChangeCheckbox (e) {
    this.setState({ activated: e.target.checked })
  }
  _handleOnClickSubmit (e) {
    this.setState({ process: true })
    e.preventDefault()
    const data = new URLSearchParams()
    data.append('title', $('#title').val())
    data.append('shortTitle', $('#shortTitle').val())
    data.append('detail', $('#detail').val())
    data.append('link', $('#link').val())
    data.append('activated', $('#activated').prop('checked'))
    // data.append('img', $('#img').val())
    let action = null
    if (this.state.mode === 'register') action = postMainBanner
    else { action = putMainBanner }
    const file = document.getElementById('img').files[0]
    let postImage
    if (this.state.mode === 'register') {
      postImage = () => postLessonImage(file)
    } else {
      postImage = file ? () => postLessonImage(file) : Promise.resolve()
    }
    postImage()
    .then(res => {
      if (res) {
        const imgUrl = res.data.data.link
        data.append('img', imgUrl)
      } else {
        data.append('img', this.props.banner.img)
      }
      return action(data, this.props.params.id)
    })
    .then(() => {
      this.setState({ process: false })
      this.context.router.push('/admin/main-banner')
    })
  }
  _handleOnClickDelete (e) {
    e.preventDefault()
    deleteMainBanner(this.props.params.id)
    .then(() => {
      this.context.router.push('/admin/main-banner')
    })
  }
  render () {
    return (
      <div>
        <form role='form'>
          <div className='form-group'>
            <label htmlFor='title'>배너제목</label>
            <input type='text' className='form-control'
              id='title' onChange={this._handleOnChangeInput}
              value={this.state.title} />
          </div>
          <div className='form-group'>
            <label htmlFor='shortTitle'>축약제목</label>
            <input type='text' className='form-control'
              id='shortTitle' onChange={this._handleOnChangeInput}
              value={this.state.shortTitle} />
          </div>
          <div className='form-group'>
            <label htmlFor='detail'>배너상세</label>
            <input type='text' className='form-control'
              id='detail' onChange={this._handleOnChangeInput}
              value={this.state.detail} />
          </div>
          <div className='form-group'>
            <label htmlFor='link'>링크</label>
            <input type='text' className='form-control'
              id='link' onChange={this._handleOnChangeInput}
              value={this.state.link} />
          </div>
          <div className='form-group'>
            <label htmlFor='img'>이미지 : {this.props.banner && <a href={this.props.banner.img} target='_blank'>{this.props.banner.img}</a>}</label>
            <input type='file' className='form-control' id='img' />
          </div>
          <div className='checkbox'>
            <label>
              <input type='checkbox' id='activated'
                onChange={this._handleOnChangeCheckbox}
                checked={this.state.activated ? 'checked' : ''} /> 활성화
            </label>
          </div>
          {/* <button type='button' className='btn btn-default' style={{ marginRight: '3px' }}
            onClick={this._handleOnClickSubmit}>{this.state.mode !== 'register' ? '수정' : '등록'}</button> */}
          <Button onClick={this._handleOnClickSubmit} process={this.state.process} style={{ marginRight: '3px' }}
            textComponent={<span>{this.state.mode !== 'register' ? '수정' : '등록'}</span>} />
          {this.state.mode === 'update' &&
            <button type='button' className='btn btn-grey' style={{ marginRight: '3px' }}
              onClick={this._handleOnClickDelete}>삭제</button>}
          <Link to='/admin/main-banner'>
            <button type='button' className='btn btn-default'>목록</button>
          </Link>
        </form>
      </div>
    )
  }
}

MainBannerRegister.propTypes = {
  banner     : React.PropTypes.object,
  fetchMainBanner: React.PropTypes.func,
  params: React.PropTypes.object.isRequired,
  clearMainBanner: React.PropTypes.func
}

MainBannerRegister.contextTypes = {
  router: React.PropTypes.object
}

export default MainBannerRegister
