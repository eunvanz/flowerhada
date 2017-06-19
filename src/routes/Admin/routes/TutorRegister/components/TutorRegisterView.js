import React, { PropTypes } from 'react'
import TextField from 'components/TextField'
import Button from 'components/Button'
import { Link } from 'react-router'
import { postTutor, putTutor, getTutorById, deleteTutor } from 'common/TutorService'
import { postLessonImage } from 'common/LessonService'

class TutorRegisterView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      introduce: '',
      image: '',
      process: false,
      mode: this.props.params.id === 'register' ? 'register' : 'update'
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._isValidForm = this._isValidForm.bind(this)
  }
  componentDidMount () {
    const { mode } = this.state
    const { params } = this.props
    if (mode === 'update') {
      getTutorById(params.id)
      .then(res => {
        const tutor = res.data
        this.setState({
          id: tutor.id,
          name: tutor.name,
          introduce: tutor.introduce.replace(/<br>/g, '\n'),
          image: tutor.image
        })
      })
    }
  }
  _handleOnChangeInput (e) {
    const { value, id } = e.target
    this.setState({ [id]: value })
  }
  _isValidForm () {
    let message = ''
    if (this.state.name === '' || this.state.introduce === '' ||
    (this.state.mode === 'register' && !document.getElementById('image').files[0])) {
      message = '모든 항목을 입력해주세요.'
    }
    if (message === '') {
      return true
    } else {
      alert(message)
      return false
    }
  }
  _handleOnClickSubmit () {
    if (!this._isValidForm()) return
    this.setState({ process: true })
    const { name, introduce } = this.state
    const tutor = {
      name,
      introduce: introduce.replace(/\n/g, '<br>')
    }
    const imageFile = document.getElementById('image').files[0]
    if (imageFile) {
      imageFile.height = 480
      imageFile.width = 480
    }
    let postImage, action
    if (this.state.mode === 'register') {
      postImage = () => postLessonImage(imageFile)
      action = postTutor
    } else {
      postImage = imageFile ? () => postLessonImage(imageFile) : () => Promise.resolve()
      action = putTutor
      tutor.id = this.state.id
    }
    postImage()
    .then(res => {
      if (res) {
        const imgUrl = res.data.data.link
        tutor.image = imgUrl
      } else {
        tutor.image = this.state.image
      }
      return action(tutor)
    })
    .then(() => {
      this.context.router.push('/admin/tutor')
    })
  }
  _handleOnClickDelete () {
    this.setState({ process: true })
    deleteTutor(this.state.id)
    .then(() => {
      this.context.router.push('/admin/tutor')
    })
  }
  render () {
    return (
      <div>
        <form role='form'>
          <TextField
            id='name'
            label='이름'
            onChange={this._handleOnChangeInput}
            value={this.state.name}
            type='text'
          />
          <TextField
            id='image'
            label='프로필이미지'
            type='file'
            accept='image/*'
            imgInfo={this.state.image}
          />
          <label>내용</label>
          <textarea id='introduce' className='form-control' rows='8'
            value={this.state.introduce} onChange={this._handleOnChangeInput}
            data-limit={1000} />
          <div className='text-right small'>
            (<span className='text-default'>{this.state.introduce.length}</span>/1000)
          </div>
          <Button onClick={this._handleOnClickSubmit} process={this.state.process} style={{ marginRight: '3px' }}
            textComponent={<span>{this.state.mode !== 'register' ? '수정' : '등록'}</span>} />
          {this.state.mode === 'update' &&
            <button type='button' className='btn btn-grey' style={{ marginRight: '3px' }}
              onClick={this._handleOnClickDelete}>삭제</button>}
          <Link to='/admin/tutor'>
            <button type='button' className='btn btn-default'>목록</button>
          </Link>
        </form>
      </div>
    )
  }
}

TutorRegisterView.contextTypes = {
  router: PropTypes.object.isRequired
}

TutorRegisterView.propTypes = {
  params: PropTypes.object
}

export default TutorRegisterView
