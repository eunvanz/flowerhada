import React from 'react'
import { Link } from 'react-router'
import backgroundImage from '../assets/images/background.jpg'
import { setInlineScripts } from 'common/util'
import validator from 'validator'
import $ from 'jquery'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Login'
    this.state = {
      email: '',
      password: ''
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._checkEmailField = this._checkEmailField.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._showErrorMessage = this._showErrorMessage.bind(this)
  }
  componentDidMount () {
    const scripts = [
      '/template/plugins/waypoints/jquery.waypoints.min.js',
      '/template/js/template.js',
      '/template/js/naverLogin_implicit-1.0.2-min.js'
    ]
    setInlineScripts(scripts)
    $('#inputPassword').keypress((e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        this._handleOnClickSubmit(e)
      }
    })
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnClickSubmit (e) {
    e.preventDefault()

    if (!this._checkEmailField() || !this._checkPasswordField()) {
      this._showErrorMessage('가입하신 이메일과 비밀번호를 입력해주세요.')
      return
    }

    const userInfo = new FormData()
    userInfo.append('email', this.state.email)
    userInfo.append('password', this.state.password)
    this.props.fetchAuthUser(userInfo)
    .then(() => {
      const sessionStorage = window.sessionStorage
      sessionStorage.setItem('authUser', JSON.stringify(this.props.authUser.data))
    })
    .then(() => {
      return this.props.fetchUser(this.props.authUser.data.email)
    })
    .then(() => {
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
    .then(() => {
      this.context.router.push('/')
    })
    .catch(() => {
      this._showErrorMessage('이메일 혹은 비밀번호가 잘못되었습니다.')
    })
  }
  _checkEmailField () {
    const email = this.state.email
    return !validator.isEmpty(email)
  }
  _checkPasswordField () {
    const password = this.state.password
    return !validator.isEmpty(password)
  }
  _showErrorMessage (message) {
    const messageElement = $('.message')
    messageElement.text(message)
    messageElement.addClass('text-danger')
  }
  _convertSuccessForm (formGroupElement, iconElement, messageElement) {
    formGroupElement.attr('class', 'form-group has-success has-feedback')
    iconElement.attr('class', 'fa fa-check form-control-feedback')
    messageElement.text('')
    $('label').css('color', '#777777')
  }
  render () {
    if (this.props.user) {
      this.context.router.push('/')
    }
    return (
      <div className='main-container dark-translucent-bg'
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      >
        <div className='container'>
          <div className='row'>
            <div className='main object-non-visible' data-animation-effect='fadeInUpSmall' data-effect-delay='100'>
              <div className='form-block center-block p-30 light-gray-bg border-clear'>
                <h2 className='title'>로그인</h2>
                <form className='form-horizontal' role='form'>
                  <div className='form-group has-feedback'>
                    <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                      소셜계정 로그인
                    </label>
                    <div className='col-sm-8'>
                      <button className='btn btn-sm btn-animated facebook' style={{ marginRight: '3px' }}>
                        페이스북 <i className='pl-10 fa fa-facebook-square' />
                      </button>
                      <button className='btn btn-sm btn-animated kakao'
                        style={{
                          backgroundColor: '#ffcc00', borderColor: '#ffcc00', color: '#422d00', marginRight: '3px'
                        }}
                      >
                        카카오 <i className='pl-10 fa fa-comment' />
                      </button>
                      <button className='btn btn-sm btn-animated naver'
                        style={{
                          backgroundColor: '#34b700', borderColor: '#34b700', color: '#ffffff'
                        }}
                      >
                        네이버 <i style={{ fontFamily: 'Archivo Black', lineHeight: '28px', fontStyle: 'normal' }}>N</i>
                      </button>
                    </div>
                  </div>
                  <div className='separator' />
                  <div className='form-group has-feedback' id='formGroupEmail'>
                    <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                      이메일주소
                    </label>
                    <div className='col-sm-8'>
                      <input type='email' className='form-control' onChange={this._handleOnChangeInput}
                        onBlur={this._checkEmailField} name='email' id='inputEmail' required />
                      <i className='fa fa-user form-control-feedback' />
                    </div>
                  </div>
                  <div className='form-group has-feedback' id='formGroupPassword'>
                    <label htmlFor='inputPassword' className='col-sm-3 control-label'>
                      비밀번호
                    </label>
                    <div className='col-sm-8'>
                      <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                        onBlur={this._checkPasswordField}
                        name='password' id='inputPassword' />
                      <i className='fa fa-lock form-control-feedback' />
                    </div>
                  </div>
                  <div className='col-sm-offset-3 col-sm-8 small message' />
                  <div className='form-group'>
                    <div className='col-sm-offset-3 col-sm-8'>
                      <button onClick={this._handleOnClickSubmit}
                        className='btn btn-group btn-block btn-default btn-animated'>
                        로그인 <i className='fa fa-key' />
                      </button>
                    </div>
                  </div>
                  <div className='form-group'>
                    <div className='col-sm-offset-3 col-sm-8'>
                      <ul>
                        <li>
                          <a>비밀번호를 잊으셨나요?</a>
                        </li>
                        <li>
                          <Link to='/sign-up'>아직 회원이 아니신가요?</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  authUser: React.PropTypes.object,
  fetchAuthUser: React.PropTypes.func.isRequired,
  fetchUser: React.PropTypes.func.isRequired,
  fetchCartsByUserId: React.PropTypes.func.isRequired,
  user: React.PropTypes.object
}

Login.contextTypes = {
  router: React.PropTypes.object
}

export default Login
