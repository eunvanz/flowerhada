import React from 'react'
import Button from 'components/Button'

class NotFound extends React.Component {
  render () {
    return (
      <section className='main-container jumbotron light-gray-bg text-center margin-clear'>
        <div className='continaer'>
          <div className='row'>
            <div className='main col-md-6 col-md-offset-3 pv-40'>
              <h1 className='page-title text-default'>404</h1>
              <h2>페이지를 찾을 수 없습니다.</h2>
              <p>요청하신 페이지가 존재하지 않거나, 요청하신 상품이 존재하지 않습니다.</p>
              <Button onClick={() => {
                this.context.router.push('/')
              }}
                size='lg' textComponent={<span>메인화면으로 <i className='fa fa-home' /></span>} animated />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

NotFound.contextTypes = {
  router: React.PropTypes.object
}

export default NotFound
