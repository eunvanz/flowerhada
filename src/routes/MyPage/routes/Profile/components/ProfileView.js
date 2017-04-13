import React, { PropTypes } from 'react'
import PhoneNumberInput from 'components/PhoneNumberInput'
import { assemblePhoneNumber, dividePhoneNumber } from 'common/util'
import Button from 'components/Button'
import validator from 'validator'
import $ from 'jquery'
import MessageModal from 'components/MessageModal'
import { updateUser, login } from 'common/UserService'
import Loading from 'components/Loading'

class ProfileView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      phone: ['010', '', ''],
      oldPassword: '',
      newPassword: '',
      passwordConfirm: '',
      changePassword: false,
      showMessageModal: false,
      updateProcess: false,
      messageModalMessage: '',
      initialized: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._checkPasswordConfirmField = this._checkPasswordConfirmField.bind(this)
    this._checkNameField = this._checkNameField.bind(this)
    this._checkPhoneField = this._checkPhoneField.bind(this)
    this._showErrorMessage = this._showErrorMessage.bind(this)
    this._convertSuccessForm = this._convertSuccessForm.bind(this)
    this._initialize = this._initialize.bind(this)
    this._handleOnClickChangePassword = this._handleOnClickChangePassword.bind(this)
    this._handleOnChangePhone = this._handleOnChangePhone.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._closeMessageModal = this._closeMessageModal.bind(this)
  }
  componentDidMount () {
    if (!this.props.user) {
      this.context.router.push('/login')
      return
    } else {
      this._initialize()
    }
  }
  _initialize () {
    this.setState({
      name: this.props.user.name,
      phone: dividePhoneNumber(this.props.user.phone),
      initialized: true
    })
  }
  _handleOnChangeInput (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  _handleOnChangePhone (e) {
    const { index } = e.target.dataset
    const phone = this.state.phone
    phone[index] = e.target.value
    this.setState({ phone })
  }
  _checkPasswordField () {
    const password = this.state.newPassword
    let message = ''
    if (validator.isEmpty(password)) message = '비밀번호를 입력해주세요.'
    else if (!validator.isLength(password, { min: 6, max: 20 })) message = '6~20자의 비밀번호를 입력해주세요.'
    else if (validator.contains(password, ' ')) message = '공백이 없는 비밀번호를 입력해주세요.'
    if (message !== '') {
      this._showErrorMessage($('#formGroupNewPassword'), $('#formGroupNewPassword i'),
        $('#formGroupPassword .message'), message)
      return false
    } else {
      this._convertSuccessForm($('#formGroupNewPassword'), $('#formGroupNewPassword i'),
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
    else if (this.state.newPassword !== password) message = '비밀번호가 틀립니다.'
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
  _handleOnClickChangePassword () {
    this.setState({ changePassword: !this.state.changePassword })
  }
  _handleOnClickSubmit () {
    this.setState({ updateProcess: true })
    const user = this.props.user
    user.name = this.state.name
    user.phone = assemblePhoneNumber(this.state.phone)
    user.regDate = null
    if (this.state.changePassword && this._checkPasswordField() && this._checkPasswordConfirmField()) {
      const userInfo = {
        email: user.email,
        password: this.state.oldPassword
      }
      login(userInfo)
      .then(() => {
        user.password = this.state.newPassword
        return updateUser(user)
      })
      .then(() => {
        this.setState({ messageModalMessage: '저장되었습니다.' })
        this.setState({ showMessageModal: true, updateProcess: false, changePassword: false })
        this.props.fetchUserByUserId(user.id)
      })
      .catch(() => {
        this.setState({ messageModalMessage: '현재 비밀번호가 틀립니다.' })
        this.setState({ showMessageModal: true, updateProcess: false })
      })
    } else {
      return updateUser(user)
      .then(() => {
        this.setState({ messageModalMessage: '저장되었습니다.' })
        this.setState({ showMessageModal: true, updateProcess: false, changePassword: false })
        this.props.fetchUserByUserId(user.id)
      })
    }
  }
  _closeMessageModal () {
    this.setState({ showMessageModal: false })
  }
  render () {
    const { user } = this.props
    if (!user) {
      this.context.router.push('/login')
      return null
    }
    const renderPasswordField = () => {
      if (this.state.changePassword) {
        return (
          <div>
            <div className='form-group has-feedback' id='formGroupPassword'>
              <label htmlFor='oldPassword' className='col-sm-2 control-label'>
                현재 비밀번호
              </label>
              <div className='col-sm-8' style={{ maxWidth: '287px' }}>
                <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                  name='oldPassword' id='oldPassword' placeholder='6~20자의 영문, 숫자 및 특수문자' required
                />
                <i className='fa fa-lock form-control-feedback' />
              </div>
            </div>
            <div className='form-group has-feedback' id='formGroupNewPassword'>
              <label htmlFor='newPassword' className='col-sm-2 control-label'>
                새 비밀번호
              </label>
              <div className='col-sm-8' style={{ maxWidth: '287px' }}>
                <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                  onBlur={this._checkPasswordField}
                  name='newPassword' id='newPassword' placeholder='6~20자의 영문, 숫자 및 특수문자' required
                />
                <i className='fa fa-lock form-control-feedback' />
                <div className='text-right small message' />
              </div>
            </div>
            <div className='form-group has-feedback' id='formGroupPasswordConfirm'>
              <label htmlFor='passwordConfirm' className='col-sm-2 control-label'>
                비밀번호 확인
              </label>
              <div className='col-sm-8' style={{ maxWidth: '287px' }}>
                <input type='password' className='form-control' onChange={this._handleOnChangeInput}
                  onBlur={this._checkPasswordConfirmField}
                  name='passwordConfirm' id='passwordConfirm' placeholder='6~20자의 영문, 숫자 및 특수문자' required
                />
                <i className='fa fa-lock form-control-feedback' />
                <div className='text-right small message' />
              </div>
            </div>
          </div>
        )
      }
    }
    const renderContent = () => {
      let returnComponent = null
      if (!this.state.initialized) {
        returnComponent = <Loading text='정보를 불러오는 중..' />
      } else {
        returnComponent = (
          <form className='form-horizontal' role='form'>
            <div className='form-group has-feedback' id='formGroupEmail'>
              <label htmlFor='inputEmail' className='col-sm-2 control-label'>
                이메일주소
              </label>
              <div className='col-sm-8' style={{ paddingTop: '7px' }}>
                {user.email}
              </div>
            </div>
            <div className='form-group has-feedback' id='formGroupName'>
              <label htmlFor='inputName' className='col-sm-2 control-label'>
                이름
              </label>
              <div className='col-sm-8' style={{ maxWidth: '287px' }}>
                <input type='text' className='form-control' id='inputName' onChange={this._handleOnChangeInput}
                  onBlur={this._checkNameField} value={this.state.name}
                  name='name' placeholder='실명을 기입해주세요.' required />
                <i className='fa fa-user form-control-feedback' />
                <div className='text-right small message' />
              </div>
            </div>
            <div className='form-group has-feedback' id='formGroupPhone'>
              <label htmlFor='inputPhone' className='col-sm-2 control-label'>
                휴대폰 번호
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
            <div className='col-sm-offset-2'>
              <Button
                link
                textComponent={
                  <span>
                    {this.state.changePassword ? '비밀번호 변경 안함' : '비밀번호 변경'} <i className={this.state.changePassword ? 'fa fa-caret-up' : 'fa fa-caret-down'} />
                  </span>
                }
                onClick={this._handleOnClickChangePassword}
              />
            </div>
            <div style={{ marginTop: '15px' }}></div>
            {renderPasswordField()}
            <div className='form-group'>
              <div className='col-sm-offset-2 col-sm-8'>
                <Button onClick={this._handleOnClickSubmit} process={this.state.updateProcess}
                  animated textComponent={<span>저장하기 <i className='fa fa-check' /></span>}
                />
              </div>
            </div>
          </form>
        )
      }
      return returnComponent
    }
    return (
      <div>
        {renderContent()}
        <MessageModal
          show={this.state.showMessageModal}
          id='mypageMessageModal'
          message={this.state.messageModalMessage}
          close={this._closeMessageModal}
          confirmBtnTxt='확인'
          onConfirmClick={this._closeMessageModal}
        />
      </div>
    )
  }
}

ProfileView.contextTypes = {
  router: PropTypes.object.isRequired
}

ProfileView.propTypes = {
  fetchUserByUserId: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default ProfileView
