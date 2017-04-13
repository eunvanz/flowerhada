import React from 'react'
import { Link } from 'react-router'
import backgroundImage from '../assets/images/background.jpg'
import { setInlineScripts } from '../../../common/util'
import { signUp, checkDupEmail } from '../../../common/UserService'
import MessageModal from '../../../components/MessageModal'
import validator from 'validator'
import $ from 'jquery'
import Loading from '../../../components/Loading'
import PhoneNumberInput from 'components/PhoneNumberInput'
import keygen from 'keygenerator'
import { assemblePhoneNumber } from 'common/util'
import Button from 'components/Button'

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
      process: false
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
  }
  componentDidMount () {
    const scripts = [
      'template/plugins/waypoints/jquery.waypoints.min.js',
      'template/plugins/jquery.countTo.js',
      'template/plugins/jquery.validate.js',
      'template/plugins/jquery.browser.js',
      'template/plugins/SmoothScroll.js',
      'template/js/template.js'
    ]
    setInlineScripts(scripts)
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnChangePhone (e) {
    const { index } = e.target.dataset
    const phone = this.state.phone
    phone[index] = e.target.value
    this.setState({ phone })
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
        image: 'avatar.jpg'
      }
      signUp(userInfo)
      .then((res) => {
        return this.props.fetchAuthUser(userInfo)
      })
      .then((res) => {
        return this.props.fetchUser(this.props.authUser.data.email)
      })
      .then((res) => {
        this.context.router.push('/')
      })
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
        return
      }
      email = validator.normalizeEmail(email)
      checkDupEmail(email)
      .then(res => {
        if (res.data.email) {
          message = '이미 가입된 이메일주소입니다.'
          this._showErrorMessage($('#formGroupEmail'), $('#formGroupEmail i'), $('#formGroupEmail .message'), message)
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
                  {/* <div className='form-group has-feedback'>
                    <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                      소셜계정으로 가입
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
                  </div> */}
                  <div className='separator' />
                  <div className='form-group has-feedback' id='formGroupEmail'>
                    <label htmlFor='inputEmail' className='col-sm-3 control-label'>
                      이메일주소 <span className='text-danger small'>*</span>
                    </label>
                    <div className='col-sm-8'>
                      <input type='email' className='form-control' onChange={this._handleOnChangeInput}
                        onBlur={this._checkEmailField} name='email' id='inputEmail'
                        placeholder='email@example.com' required />
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
                        name='password' id='inputPassword' placeholder='6~20자의 영문, 숫자 및 특수문자' required
                      />
                      <i className='fa fa-lock form-control-feedback' />
                      <div className='text-right small message' />
                    </div>
                  </div>
                  <div className='form-group has-feedback' id='formGroupPasswordConfirm'>
                    <label htmlFor='inputPassword' className='col-sm-3 control-label'>
                      비밀번호 확인 <span className='text-danger small'>*</span>
                    </label>
                    <div className='col-sm-8'>
                      <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                        onBlur={this._checkPasswordConfirmField}
                        name='passwordConfirm' id='inputPassword' placeholder='6~20자의 영문, 숫자 및 특수문자' required
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
                        name='name' placeholder='실명을 기입해주세요.' required />
                      <i className='fa fa-user form-control-feedback' />
                      <div className='text-right small message' />
                    </div>
                  </div>
                  <div className='form-group has-feedback' id='formGroupPhone'>
                    <label htmlFor='inputPhone' className='col-sm-3 control-label'>
                      휴대폰 번호 <span className='text-danger small'>*</span>
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
                          <input type='checkbox' name='isAgreed' onChange={this._handleOnChangeAgreed} required />
                          <Link to='#'>이용약관</Link>과 <Link to='#'>개인정보수집</Link>에 동의합니다.
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
      </div>
    )
  }
}

SignUp.propTypes = {
  authUser: React.PropTypes.object,
  fetchAuthUser: React.PropTypes.func.isRequired,
  fetchUser: React.PropTypes.func.isRequired
}

SignUp.contextTypes = {
  router: React.PropTypes.object
}

export default SignUp
