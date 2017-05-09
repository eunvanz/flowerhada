import React from 'react'
import backgroundImage from '../assets/images/background.jpg'
import { setInlineScripts, assemblePhoneNumber, handleOnChangePhone } from 'common/util'
import { signUp, checkDupEmail } from 'common/UserService'
import MessageModal from 'components/MessageModal'
import validator from 'validator'
import $ from 'jquery'
import Loading from 'components/Loading'
import PhoneNumberInput from 'components/PhoneNumberInput'
import keygen from 'keygenerator'
import Button from 'components/Button'
import ScrollModal from 'components/ScrollModal'
import { policy, privacy, NAVER_CLIENT_ID, SOCIAL_LOGIN_CALLBACK_URL } from 'common/constants'
import { Facebook } from 'common/socialUtil'

class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'SignUp'
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      isAgreed: false,
      showMessagePopup: false,
      phone: ['010', '', ''],
      process: false,
      showPolicyPopup: false,
      showPrivacyPopup: false,
      showForm: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnChangeAgreed = this._handleOnChangeAgreed.bind(this)
    this._handleOnClickMessageClose = this._handleOnClickMessageClose.bind(this)
    this._checkEmailField = this._checkEmailField.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._checkPasswordConfirmField = this._checkPasswordConfirmField.bind(this)
    this._checkNameField = this._checkNameField.bind(this)
    this._showErrorMessage = this._showErrorMessage.bind(this)
    this._convertSuccessForm = this._convertSuccessForm.bind(this)
    this._checkPhoneField = this._checkPhoneField.bind(this)
    this._handleOnChangePhone = this._handleOnChangePhone.bind(this)
    this._showPolicyPopup = this._showPolicyPopup.bind(this)
    this._closePolicyPopup = this._closePolicyPopup.bind(this)
    this._showPrivacyPopup = this._showPrivacyPopup.bind(this)
    this._closePrivacyPopup = this._closePrivacyPopup.bind(this)
    this._handleOnClickLoginWithNaver = this._handleOnClickLoginWithNaver.bind(this)
    this._handleOnClickShowForm = this._handleOnClickShowForm.bind(this)
    this._handleOnClickLoginWithFacebook = this._handleOnClickLoginWithFacebook.bind(this)
    this._loginProcess = this._loginProcess.bind(this)
  }
  componentDidMount () {
    if (this.props.user) this.context.router.push('/')
    const scripts = [
      // '/template/plugins/waypoints/jquery.waypoints.min.js',
      // '/template/plugins/jquery.countTo.js',
      // '/template/plugins/jquery.validate.js',
      // '/template/plugins/jquery.browser.js',
      // '/template/plugins/SmoothScroll.js',
      '/template/js/template.js'
    ]
    setInlineScripts(scripts)
    const naver_id_login = new window.naver_id_login(NAVER_CLIENT_ID, SOCIAL_LOGIN_CALLBACK_URL)
    const state = naver_id_login.getUniqState()
    naver_id_login.setButton('white', 2, 40)
    naver_id_login.setState(state)
    // if (isMobile.any()) naver_id_login.setPopup()
    naver_id_login.init_naver_id_login()
    Facebook.init()
  }
  _handleOnChangeInput (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnChangePhone (e) {
    handleOnChangePhone(e, this, 'phone')
  }
  _handleOnChangeAgreed (e) {
    this.setState({ isAgreed: e.target.checked })
  }
  _handleOnClickSubmit (e) {
    e.preventDefault()

    this._checkEmailField()
    .then(() => {
      if (!this._checkPasswordField() || !this._checkPasswordConfirmField() || !this._checkNameField() || !this._checkPhoneField()) {
        return
      }
      if (!this.state.isAgreed) {
        this.setState({ showMessagePopup: true })
        return
      }
      const userInfo = { email: this.state.email,
        password: this.state.password,
        name: this.state.name,
        phone: assemblePhoneNumber(this.state.phone),
        image: '/images/avatar.jpg'
      }
      signUp(userInfo)
      .then((res) => {
        console.log('res', res)
        return this.props.fetchAuthUser(userInfo.email, userInfo.password)
      })
      .then((res) => {
        document.cookie = `authUser=${JSON.stringify(this.props.authUser.data)}; max-age=${60 * 60 * 24}; path=/;`
        return this.props.fetchUser(this.props.authUser.data.id)
      })
      .then((res) => {
        this.context.router.push('/')
      })
    })
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
  _handleOnClickMessageClose () {
    this.setState({ showMessagePopup: false })
  }
  _checkEmailField () {
    return new Promise((resolve, reject) => {
      let email = this.state.email
      let message = ''
      if (validator.isEmpty(email)) message = '이메일주소를 입력해주세요.'
      else if (!validator.isEmail(email)) message = '이메일주소 형식이 아닙니다.'
      else if (!validator.isLength(email, { min: 5, max: 50 })) message = '5~50자의 이메일주소를 사용해주세요.'
      if (message !== '') {
        this._showErrorMessage($('#formGroupEmail'), $('#formGroupEmail i'), $('#formGroupEmail .message'), message)
        $('#inputEmail').focus()
        return
      }
      email = validator.normalizeEmail(email)
      checkDupEmail(email)
      .then(res => {
        if (res.data.email) {
          message = '이미 가입된 이메일주소입니다.'
          this._showErrorMessage($('#formGroupEmail'), $('#formGroupEmail i'), $('#formGroupEmail .message'), message)
          $('#inputEmail').focus()
        } else {
          this._convertSuccessForm($('#formGroupEmail'), $('#formGroupEmail i'), $('#formGroupEmail .message'))
          resolve()
        }
      })
    })
  }
  _checkPasswordField () {
    const password = this.state.password
    let message = ''
    if (validator.isEmpty(password)) message = '비밀번호를 입력해주세요.'
    else if (!validator.isLength(password, { min: 6, max: 20 })) message = '6~20자의 비밀번호를 입력해주세요.'
    else if (validator.contains(password, ' ')) message = '공백이 없는 비밀번호를 입력해주세요.'
    if (message !== '') {
      this._showErrorMessage($('#formGroupPassword'), $('#formGroupPassword i'),
        $('#formGroupPassword .message'), message)
      $('#inputPassword').focus()
      return false
    } else {
      this._convertSuccessForm($('#formGroupPassword'), $('#formGroupPassword i'),
        $('#formGroupPassword .message'))
      return true
    }
  }
  _checkPasswordConfirmField () {
    const password = this.state.passwordConfirm
    let message = ''
    if (validator.isEmpty(password)) message = '비밀번호를 입력해주세요.'
    else if (!validator.isLength(password, { min: 6, max: 20 })) message = '6~20자의 비밀번호를 입력해주세요.'
    else if (validator.contains(password, ' ')) message = '공백이 없는 비밀번호를 입력해주세요.'
    else if (this.state.password !== password) message = '비밀번호가 틀립니다.'
    if (message !== '') {
      this._showErrorMessage($('#formGroupPasswordConfirm'), $('#formGroupPasswordConfirm i'),
        $('#formGroupPasswordConfirm .message'), message)
      $('#inputPasswordConfirm').focus()
      return false
    } else {
      this._convertSuccessForm($('#formGroupPasswordConfirm'), $('#formGroupPasswordConfirm i'),
        $('#formGroupPasswordConfirm .message'))
      return true
    }
  }
  _checkNameField () {
    const name = this.state.name
    let message = ''
    const korCheck = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i
    if (validator.isEmpty(name)) message = '이름을 입력해주세요.'
    else if (korCheck.test(name)) message = '한글 이름을 입력해주세요.'
    else if (!validator.isLength(name, { min: 1, max: 20 })) message = '20자 이하의 이름을 입력해주세요.'
    else if (validator.contains(name, ' ')) message = '이름을 공백없이 입력해주세요.'
    if (message !== '') {
      this._showErrorMessage($('#formGroupName'), $('#formGroupName i'),
        $('#formGroupName .message'), message)
      $('#inputName').focus()
      return false
    } else {
      this._convertSuccessForm($('#formGroupName'), $('#formGroupName i'),
        $('#formGroupName .message'))
      return true
    }
  }
  _checkPhoneField () {
    const phone = this.state.phone
    let message = ''
    if (validator.isEmpty(phone[1]) || validator.isEmpty(phone[2])) message = '휴대폰 번호를 입력해주세요.'
    else if (!validator.isNumeric(phone[1] + phone[2])) message = '휴대폰 번호는 숫자만 입력해주세요.'
    if (message !== '') {
      this._showErrorMessage($('#formGroupPhone'), $('#formGroupPhone i'), $('#formGroupPhone .message'), message)
      return false
    } else {
      this._convertSuccessForm($('#formGroupPhone'), $('#formGroupPhone i'),
        $('#formGroupPhone .message'))
      return true
    }
  }
  _showErrorMessage (formGroupElement, iconElement, messageElement, message) {
    formGroupElement.attr('class', 'form-group has-error has-feedback')
    iconElement.attr('class', 'fa fa-times form-control-feedback')
    messageElement.text(message)
    messageElement.addClass('text-danger')
    $('label').css('color', '#777777')
  }
  _convertSuccessForm (formGroupElement, iconElement, messageElement) {
    formGroupElement.attr('class', 'form-group has-success has-feedback')
    iconElement.attr('class', 'fa fa-check form-control-feedback')
    messageElement.text('')
    $('label').css('color', '#777777')
  }
  _showPolicyPopup (e) {
    e.preventDefault()
    this.setState({ showPolicyPopup: true })
  }
  _closePolicyPopup () {
    this.setState({ showPolicyPopup: false })
  }
  _showPrivacyPopup (e) {
    e.preventDefault()
    this.setState({ showPrivacyPopup: true })
  }
  _closePrivacyPopup () {
    this.setState({ showPrivacyPopup: false })
  }
  _handleOnClickLoginWithNaver (e) {
    e.preventDefault()
    $('#naver_id_login img').click()
  }
  _handleOnClickShowForm () {
    this.setState({ showForm: true })
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
                <h2 className='title'>회원가입</h2>
                <form className='form-horizontal' role='form'>
                  { !this.state.showForm &&
                    <div className='form-group has-feedback'>
                      <label className='col-sm-3 control-label'>
                        소셜계정 로그인
                      </label>
                      <div className='col-sm-8'>
                        <button className='btn btn-animated facebook btn-block' onClick={this._handleOnClickLoginWithFacebook}>
                          페이스북계정으로 로그인 <i className='pl-10 fa fa-facebook-square' />
                        </button>
                        {/* <button className='btn btn-animated kakao btn-block'
                          style={{
                            backgroundColor: '#ffcc00', borderColor: '#ffcc00', color: '#422d00',
                          }}
                        >
                          카카오계정으로 로그인 <i className='pl-10 fa fa-comment' />
                        </button> */}
                        <div id='naver_id_login' style={{ display: 'none' }}></div>
                        <button className='btn btn-animated naver btn-block'
                          style={{
                            backgroundColor: '#34b700', borderColor: '#34b700', color: '#ffffff'
                          }}
                          onClick={this._handleOnClickLoginWithNaver}
                        >
                          네이버계정으로 로그인 <i style={{ fontFamily: 'Archivo Black', lineHeight: '32px', fontStyle: 'normal' }}>N</i>
                        </button>
                      </div>
                    </div>
                  }
                  {
                    !this.state.showForm &&
                    <div className='form-group has-feedback'>
                      <label className='col-sm-3 control-label'>
                        직접 회원가입
                      </label>
                      <div className='col-sm-8'>
                        <Button
                          textComponent={<span>이메일로 회원가입 <i className='fa fa-envelope' /></span>}
                          animated
                          className='btn-block'
                          style={{ color: 'white' }}
                          onClick={this._handleOnClickShowForm}
                        />
                      </div>
                    </div>
                  }
                  {
                    this.state.showForm &&
                    <div>
                      <div className='form-group has-feedback' id='formGroupEmail'>
                        <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                          이메일주소 <span className='text-danger small'>*</span>
                        </label>
                        <div className='col-sm-8'>
                          <input type='email' className='form-control' onChange={this._handleOnChangeInput}
                            onBlur={this._checkEmailField} name='email' id='inputEmail'
                            placeholder='email@example.com' />
                          <i className='fa fa-envelope form-control-feedback' />
                          {this.props.authUser.isLoading &&
                            <Loading />
                          }
                          <div className='text-right small message' />
                        </div>
                      </div>
                      <div className='form-group has-feedback' id='formGroupPassword'>
                        <label htmlFor='inputPassword' className='col-sm-3 control-label'>
                          비밀번호 <span className='text-danger small'>*</span>
                        </label>
                        <div className='col-sm-8'>
                          <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                            onBlur={this._checkPasswordField}
                            name='password' id='inputPassword' placeholder='6~20자의 영문, 숫자 및 특수문자'
                          />
                          <i className='fa fa-lock form-control-feedback' />
                          <div className='text-right small message' />
                        </div>
                      </div>
                      <div className='form-group has-feedback' id='formGroupPasswordConfirm'>
                        <label htmlFor='inputPasswordConfirm' className='col-sm-3 control-label'>
                          비밀번호 확인 <span className='text-danger small'>*</span>
                        </label>
                        <div className='col-sm-8'>
                          <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                            onBlur={this._checkPasswordConfirmField}
                            name='passwordConfirm' id='inputPasswordConfirm' placeholder='6~20자의 영문, 숫자 및 특수문자'
                          />
                          <i className='fa fa-lock form-control-feedback' />
                          <div className='text-right small message' />
                        </div>
                      </div>
                      <div className='form-group has-feedback' id='formGroupName'>
                        <label htmlFor='inputName' className='col-sm-3 control-label'>
                          이름 <span className='text-danger small'>*</span>
                        </label>
                        <div className='col-sm-8'>
                          <input type='text' className='form-control' id='inputName' onChange={this._handleOnChangeInput}
                            onBlur={this._checkNameField}
                            name='name' placeholder='실명을 기입해주세요.' />
                          <i className='fa fa-user form-control-feedback' />
                          <div className='text-right small message' />
                        </div>
                      </div>
                      <div className='form-group has-feedback' id='formGroupPhone'>
                        <label htmlFor='inputPhone' className='col-sm-3 control-label'>
                          휴대폰번호 <span className='text-danger small'>*</span>
                        </label>
                        <div className='col-sm-8'>
                          <PhoneNumberInput
                            valueStart={this.state.phone[0]}
                            valueMid={this.state.phone[1]}
                            valueEnd={this.state.phone[2]}
                            onChange={this._handleOnChangePhone}
                            onBlur={this._checkPhoneField}
                          />
                          <div className='text-right small message' />
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                          <div className='checkbox'>
                            <label>
                              <input type='checkbox' name='isAgreed' onChange={this._handleOnChangeAgreed} />
                              <a onClick={this._showPolicyPopup} style={{ cursor: 'pointer' }}>이용약관</a>과 <a onClick={this._showPrivacyPopup} style={{ cursor: 'pointer' }}>개인정보수집</a>에 동의합니다.
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                          <Button
                            textComponent={<span>가입하기 <i className='fa fa-check' /></span>}
                            animated
                            className='btn-block'
                            style={{ color: 'white' }}
                            onClick={this._handleOnClickSubmit}
                            process={this.state.process}
                          />
                        </div>
                      </div>
                    </div>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
        <MessageModal
          show={this.state.showMessagePopup}
          close={this._handleOnClickMessageClose}
          message={'이용약관과 개인정보수집에 동의해주세요.'}
          confirmBtnTxt={'확인'}
          onConfirmClick={this._handleOnClickMessageClose}
          id={keygen._()}
        />
        <ScrollModal
          title='이용약관'
          show={this.state.showPolicyPopup}
          close={this._closePolicyPopup}
          bodyComponent={<div dangerouslySetInnerHTML={{ __html: policy }} />}
          id={keygen._()}
        />
        <ScrollModal
          title='개인정보처리방침'
          show={this.state.showPrivacyPopup}
          close={this._closePrivacyPopup}
          bodyComponent={<div dangerouslySetInnerHTML={{ __html: privacy }} />}
          id={keygen._()}
        />
      </div>
    )
  }
}

SignUp.propTypes = {
  authUser: React.PropTypes.object,
  fetchAuthUser: React.PropTypes.func.isRequired,
  fetchUser: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  fetchSocialAuthUser: React.PropTypes.func.isRequired,
  fetchCartsByUserId: React.PropTypes.func.isRequired
}

SignUp.contextTypes = {
  router: React.PropTypes.object
}

export default SignUp
