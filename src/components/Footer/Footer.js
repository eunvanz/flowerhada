import React from 'react'
import { address, phone, email, facebook, instagram } from 'common/constants'

class Footer extends React.Component {
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
                      <i className='text-muted' style={{ fontFamily: 'Niconne, cursive', lineHeight: '28px', fontSize: '38px', fontStyle: 'normal' }}>Flower<span className='text-default'>hada</span></i>
                    </div>
                    <ul className='list-inline mb-20'>
                      <li>
                        <span className='text-default'>상호명</span> flowerhada(꽃하다)
                      </li>
                      <li>
                        <span className='text-default'>사업자등록번호</span> 210-26-67507
                      </li>
                      <li>
                        <span className='text-default'>통신판매업신고</span> 2017-서울송파-01121호
                      </li>
                      <li>
                        <span className='text-default'>대표</span> 성스런
                      </li>
                      <li>
                        <i className='text-default fa fa-map-marker pr-5' /> {address}
                      </li>
                      <li>
                        <i className='text-default fa fa-phone pl-10 pr-5' /> {phone}
                      </li>
                      <li>
                        <i className='text-default fa fa-envelope-o pl-10 pr-5' /> {email}
                      </li>
                    </ul>
                    <ul className='social-links circle animated-effect-1 margin-clear'>
                      <li className='facebook'>
                        <a href={facebook} target='_blank'>
                          <i className='fa fa-facebook' style={{ cursor: 'pointer' }} />
                        </a>
                      </li>
                      <li className='flickr'>
                        <a href={instagram} target='_blank'>
                          <i className='fa fa-instagram' style={{ cursor: 'pointer' }} />
                        </a>
                      </li>
                    </ul>
                    <div className='separator' />
                    <p className='text-center margin-clear'>
                      Copyright © 2017 <span className='text-default'>hada</span>. All Right Reserved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
