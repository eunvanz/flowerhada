import React from 'react'
import { address, phone, email, facebook, instagram, LOGO_FONT, mobile, policy, privacy } from 'common/constants'
import ScrollModal from 'components/ScrollModal'
import keygen from 'keygenerator'

class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPolicyPopup: false,
      showPrivacyPopup: false
    }
    this._showPolicyPopup = this._showPolicyPopup.bind(this)
    this._closePolicyPopup = this._closePolicyPopup.bind(this)
    this._showPrivacyPopup = this._showPrivacyPopup.bind(this)
    this._closePrivacyPopup = this._closePrivacyPopup.bind(this)
    this._showBizInfoPopup = this._showBizInfoPopup.bind(this)
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
  _showBizInfoPopup () {
    const url = 'http://www.ftc.go.kr/info/bizinfo/communicationViewPopup.jsp?wrkr_no=5409900351'
    window.open(url, 'communicationViewPopup', 'width=750, height-700')
  }
  render () {
    return (
      <footer id='footer' className='cleafix dark'>
        <div className='footer'>
          <div className='container'>
            <div className='footer-inner'>
              <div className='row'>
                <div className='col-md-6 col-md-offset-3'>
                  <div className='footer-content text-center padding-ver-clear'>
                    <div className='logo-footer'>
                      <i className='text-muted' style={{ fontFamily: `${LOGO_FONT}, cursive`, lineHeight: '28px', fontSize: '38px', fontStyle: 'normal' }}>flower<span className='text-default'>hada</span></i>
                    </div>
                    <ul className='list-inline mb-20'>
                      <li>
                        <a onClick={this._showPolicyPopup} style={{ cursor: 'pointer' }}><span className='text-default'>이용약관</span></a>
                      </li>
                      <li>
                        <a onClick={this._showPrivacyPopup} style={{ cursor: 'pointer' }}><span className='text-default'>개인정보취급방침</span></a>
                      </li>
                      <li>
                        <a onClick={this._showBizInfoPopup} style={{ cursor: 'pointer' }}><span className='text-default'>사업자정보확인</span></a>
                      </li>
                    </ul>
                    <ul className='list-inline mb-20'>
                      <li>
                        <span className='text-default'>상호명</span> flowerhada(꽃하다)
                      </li>
                      <li>
                        <span className='text-default'>사업자등록번호</span> 540-99-00351
                      </li>
                      <li>
                        <span className='text-default'>통신판매업신고</span> 2017-서울송파-1558호
                      </li>
                      <li>
                        <span className='text-default'>대표</span> 성스런
                      </li>
                      <li>
                        <i className='text-default fa fa-map-marker pr-5' /> {address}
                      </li>
                      {/* <li>
                        <i className='text-default fa fa-phone pl-10 pr-5' /> {phone}
                      </li> */}
                      <li>
                        <i className='text-default fa fa-mobile pl-10 pr-5' /> {mobile}
                      </li>
                      <li>
                        <i className='text-default fa fa-envelope-o pl-10 pr-5' /> {email}
                      </li>
                    </ul>
                    <ul className='social-links circle animated-effect-1 margin-clear'>
                      {/* <li className='facebook'>
                        <a href={facebook} target='_blank'>
                          <i className='fa fa-facebook' style={{ cursor: 'pointer' }} />
                        </a>
                      </li> */}
                      <li className='flickr'>
                        <a href={instagram} target='_blank'>
                          <i className='fa fa-instagram' style={{ cursor: 'pointer' }} />
                        </a>
                      </li>
                    </ul>
                    <div className='separator' />
                    <p className='text-center margin-clear'>
                      Copyright © 2017 <span className='text-default'>flowerhada</span>. All Right Reserved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </footer>
    )
  }
}

export default Footer
