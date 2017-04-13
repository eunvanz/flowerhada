import React, { PropTypes } from 'react'
import CustomModal from 'components/CustomModal'
import PhoneNumberInput from 'components/PhoneNumberInput'
import Button from 'components/Button'
import { getUserByPhone, resetUserPassword, getUserByEmail } from 'common/UserService'
import { assemblePhoneNumber } from 'common/util'
import keygen from 'keygenerator'

class FindPasswordModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: '비밀번호찾기',
      phone: ['010', '', ''],
      email: '',
      process: false,
      resultEmails: null,
      resultMessage: '',
      renderResultMessage: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnChangePhone = this._handleOnChangePhone.bind(this)
    this._handleOnClickSearch = this._handleOnClickSearch.bind(this)
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.show && !this.props.show) {
      this.setState({
        mode: '비밀번호찾기',
        phone: ['010', '', ''],
        email: '',
        process: false,
        resultEmails: null,
        resultMessage: '',
        renderResultMessage: false
      })
    }
  }
  _handleOnChangePhone (e) {
    const { index } = e.target.dataset
    const phone = this.state.phone
    phone[index] = e.target.value
    this.setState({ phone })
  }
  _handleOnChangeInput (e) {
    const { value } = e.target
    this.setState({ email: value })
  }
  _handleOnClickSearch () {
    const { mode, phone, email } = this.state
    if (mode === '비밀번호찾기') {
      this.setState({ process: true })
      getUserByEmail(email)
      .then(res => {
        if (res.data.email) {
          return resetUserPassword(email)
          .then(() => {
            this.setState({ resultMessage: '이메일로 임시비밀번호를 발급했습니다.', renderResultMessage: true, process: false })
          })
        } else {
          this.setState({ resultMessage: '가입되지 않은 이메일입니다.', renderResultMessage: true, process: false })
        }
      })
    } else if (mode === '아이디찾기') {
      this.setState({ process: true })
      getUserByPhone(assemblePhoneNumber(phone))
      .then(res => {
        const users = res.data
        this.setState({ resultEmails: users.map(user => user.email), renderResultMessage: true, process: false })
      })
    }
  }
  render () {
    const renderResultMessage = () => {
      if (this.state.renderResultMessage) {
        if (this.state.mode === '아이디찾기') {
          const { resultEmails } = this.state
          if (resultEmails.length > 0) {
            return (
              <div className='col-sm-offset-3'>
                <p className='text-default'>아래의 아이디로 가입하셨습니다.</p>
                {this.state.resultEmails.map(email => <span key={keygen._()}>{email}<br /></span>)}
              </div>
            )
          } else {
            return (
              <div className='col-sm-offset-3'>
                <p className='text-default'>가입된 아이디가 없습니다.</p>
              </div>
            )
          }
        } else if (this.state.mode === '비밀번호찾기') {
          return (
            <div className='col-sm-offset-3'>
              <p className='text-default'>{this.state.resultMessage}</p>
            </div>
          )
        }
      }
    }
    const renderForm = () => {
      let returnComponent = null
      if (this.state.mode === '아이디찾기') {
        returnComponent = (
          <div className='form-horizontal'>
            <div className='form-group has-feedback' id='formGroupPhone'>
              <label htmlFor='inputPhone' className='col-sm-3 control-label'>
                휴대폰번호
              </label>
              <div className='col-sm-8'>
                <PhoneNumberInput
                  valueStart={this.state.phone[0]}
                  valueMid={this.state.phone[1]}
                  valueEnd={this.state.phone[2]}
                  onChange={this._handleOnChangePhone}
                />
              </div>
            </div>
          </div>
        )
      } else if (this.state.mode === '비밀번호찾기') {
        returnComponent = (
          <div className='form-horizontal'>
            <div className='form-group has-feedback' id='formGroupPhone'>
              <label htmlFor='inputPhone' className='col-sm-3 control-label'>
                이메일주소
              </label>
              <div className='col-sm-8'>
                <input type='email' className='form-control' onChange={this._handleOnChangeInput}
                  name='email' id='inputEmail'
                  placeholder='email@example.com' required />
              </div>
            </div>
          </div>
        )
      }
      return returnComponent
    }
    const renderBodyComponent = () => {
      return (
        <div>
          <div>
            <ul className='nav nav-pills' role='tablist'>
              <li className={this.state.mode === '비밀번호찾기' ? 'active' : null}>
                <a style={{ cursor: 'pointer' }} onClick={() => this.setState({ mode: '비밀번호찾기' })}>
                  <i className='fa fa-key' /> 비밀번호찾기
                </a>
              </li>
              <li className={this.state.mode === '아이디찾기' ? 'active' : null}>
                <a style={{ cursor: 'pointer' }} onClick={() => this.setState({ mode: '아이디찾기' })}>
                  <i className='fa fa-user' /> 아이디찾기
                </a>
              </li>
            </ul>
          </div>
          {renderForm()}
          {renderResultMessage()}
        </div>
      )
    }
    const renderFooterComponent = () => {
      return (
        <div className='text-right'>
          <Button className='margin-clear' textComponent={<span>닫기</span>} color='dark' onClick={this.props.close} />
          <Button
            className='margin-clear'
            textComponent={<span><i className='fa fa-search' />찾기</span>}
            animated
            process={this.state.process}
            onClick={this._handleOnClickSearch}
          />
        </div>
      )
    }
    return (
      <CustomModal
        title='비밀번호찾기'
        bodyComponent={renderBodyComponent()}
        footerComponent={renderFooterComponent()}
        width='500px'
        show={this.props.show}
        close={this.props.close}
        id='findPasswordModal'
      />
    )
  }
}

FindPasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
}

export default FindPasswordModal
