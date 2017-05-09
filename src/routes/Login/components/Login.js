import React from 'react'
import { Link } from 'react-router'
import backgroundImage from '../assets/images/background.jpg'
import { setInlineScripts } from 'common/util'
import validator from 'validator'
import $ from 'jquery'
import FindPasswordModal from 'components/FindPasswordModal'
import Button from 'components/Button'
import { NAVER_CLIENT_ID, SOCIAL_LOGIN_CALLBACK_URL, SOCIAL_PASSWORD } from 'common/constants'
import { getUserByEmailAndSocialType, signUp } from 'common/UserService'
import { Facebook } from 'common/socialUtil'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Login'
    this.state = {
      email: '',
      password: '',
      showFindPasswordModal: false,
      process: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._checkEmailField = this._checkEmailField.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._showErrorMessage = this._showErrorMessage.bind(this)
    this._loginProcess = this._loginProcess.bind(this)
    this._handleOnClickLoginWithNaver = this._handleOnClickLoginWithNaver.bind(this)
    this._handleOnClickLoginWithFacebook = this._handleOnClickLoginWithFacebook.bind(this)
  }
  componentDidMount () {
    if (this.props.user) {
      this.context.router.push('/')
      return
    }
    const scripts = [
      // '/template/plugins/waypoints/jquery.waypoints.min.js',
      '/template/js/template.js'
      // '/template/js/naverLogin_implicit-1.0.2-min.js'
    ]
    setInlineScripts(scripts)
    $('#inputPassword').keypress((e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        this._handleOnClickSubmit(e)
      }
    })
    // 소셜로그인 처리
    // 페이스북
    Facebook.init()
    // 네이버
    const naver_id_login = new window.naver_id_login(NAVER_CLIENT_ID, SOCIAL_LOGIN_CALLBACK_URL)
    const state = naver_id_login.getUniqState()
    naver_id_login.setButton('white', 2, 40)
    naver_id_login.setState(state)
    // if (isMobile.any()) naver_id_login.setPopup()
    naver_id_login.init_naver_id_login()
    // console.log(naver_id_login.oauthParams.access_token)
    if (naver_id_login.oauthParams.access_token) {
      window.naverSignInCallback = () => {
        this.setState({ process: true })
        const socialType = 'naver'
        const email = naver_id_login.getProfileData('email')
        const name = naver_id_login.getProfileData('name')
        const image = naver_id_login.getProfileData('profile_image')
        getUserByEmailAndSocialType(email, socialType)
        .then(res => {
          const { data } = res
          if (data && data !== '') {
            // console.log('로그인처리')
            // 로그인처리
            const userInfo = { email, password: SOCIAL_PASSWORD }
            this._loginProcess(userInfo, socialType)
          } else {
            // console.log('회원가입처리')
            // 회원가입처리
            const userInfo = {
              email,
              password: SOCIAL_PASSWORD,
              name,
              image,
              socialType
            }
            // console.log('userInfo', userInfo)
            signUp(userInfo)
            .then((res) => {
              this._loginProcess(userInfo, socialType)
            })
          }
        })
      }
      naver_id_login.get_naver_userprofile('naverSignInCallback()')
    }
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.user) this.context.router.push('/')
  }
  _handleOnChangeInput (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnClickSubmit (e) {
    e.preventDefault()
    if (!this._checkEmailField() || !this._checkPasswordField()) {
      this._showErrorMessage('가입하신 이메일과 비밀번호를 입력해주세요.')
      return
    }
    this.setState({ process: true })
    const userInfo = { email: this.state.email, password: this.state.password }
    this._loginProcess(userInfo, null)
  }
  _loginProcess (userInfo, socialType) {
    // console.log('socialType', socialType)
    let authUserFetcher = () => this.props.fetchAuthUser(userInfo.email, userInfo.password)
    if (socialType) authUserFetcher = () => this.props.fetchSocialAuthUser(userInfo.email, userInfo.password, socialType)
    authUserFetcher()
    .then(() => {
      document.cookie = `authUser=${JSON.stringify(this.props.authUser.data)}; max-age=${60 * 60 * 24}; path=/;`
      return Promise.resolve()
    })
    .then(() => {
      return this.props.fetchUser(this.props.authUser.data.id)
    })
    .then(() => {
      return this.props.fetchCartsByUserId(this.props.user.id)
    })
    .then(() => {
      this.setState({ process: false })
      if (socialType) {
        this.context.router.push('/')
      } else {
        this.context.router.goBack()
      }
    })
    .catch((res) => {
      this.setState({ process: false })
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
  _handleOnClickLoginWithNaver (e) {
    e.preventDefault()
    $('#naver_id_login img').click()
  }
  _handleOnClickLoginWithFacebook (e) {
    e.preventDefault()
    Facebook.login(this._loginProcess)
  }
  render () {
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
                  <div className='form-group has-feedback' id='formGroupEmail'>
                    <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                      이메일주소
                    </label>
                    <div className='col-sm-8'>
                      <input type='email' className='form-control' onChange={this._handleOnChangeInput}
                        onBlur={this._checkEmailField} name='email' id='inputEmail' />
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
                      <Button
                        onClick={this._handleOnClickSubmit}
                        className='btn-block'
                        style={{ color: 'white' }}
                        textComponent={<span><i className='fa fa-key' />로그인</span>}
                        animated
                        process={this.state.process}
                      />
                    </div>
                  </div>
                  <div className='form-group has-feedback'>
                    <label className='col-sm-3 control-label'>
                      소셜계정 로그인
                    </label>
                    <div className='col-sm-8'>
                      <button className='btn btn-animated facebook btn-block' onClick={this._handleOnClickLoginWithFacebook} >
                        페이스북계정으로 로그인 <i className='pl-10 fa fa-facebook-square' />
                      </button>
                      {/* <button className='btn btn-animated kakao btn-block'
                        style={{
                          backgroundColor: '#ffcc00', borderColor: '#ffcc00', color: '#422d00'
                        }}
                        onClick={this._handleOnClickLoginWithKakao}
                      >
                        카카오계정으로 로그인 <i className='pl-10 fa fa-comment' />
                      </button> */}
                      <div id='naver_id_login' style={{ display: 'none' }}></div>
                      <button className='btn btn-animated naver btn-block' onClick={this._handleOnClickLoginWithNaver}
                        style={{
                          backgroundColor: '#34b700', borderColor: '#34b700', color: '#ffffff'
                        }}
                      >
                        네이버계정으로 로그인 <i style={{ fontFamily: 'Archivo Black', lineHeight: '32px', fontStyle: 'normal' }}>N</i>
                      </button>
                    </div>
                  </div>
                  <div className='form-group'>
                    <div className='col-sm-offset-3 col-sm-8'>
                      <ul>
                        <li>
                          <a style={{ cursor: 'pointer' }}
                            onClick={() => this.setState({ showFindPasswordModal: true })}>비밀번호를 잊으셨나요?</a>
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
        <FindPasswordModal show={this.state.showFindPasswordModal}
          close={() => this.setState({ showFindPasswordModal: false })} />
      </div>
    )
  }
}

Login.propTypes = {
  authUser: React.PropTypes.object,
  fetchAuthUser: React.PropTypes.func.isRequired,
  fetchUser: React.PropTypes.func.isRequired,
  fetchCartsByUserId: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  fetchSocialAuthUser: React.PropTypes.func.isRequired
}

Login.contextTypes = {
  router: React.PropTypes.object
}

export default Login
