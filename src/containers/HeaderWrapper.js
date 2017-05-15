import React, { Component, PropTypes } from 'react'
// import { connect } from 'react-redux'
import Header from '../components/Header'

export default (ComposedComponent, store) => {
  class HeaderWrapper extends Component {
    constructor (props) {
      super(props)
      this.displayName = 'HeaderWrapper'
    }
    render () {
      return (
        <div>
          <Header authUser={store.authUser} />
          <ComposedComponent {...this.props} />
        </div>
      )
      // let returnComponent = null
      // if (!this.props.user) {
      //   returnComponent = (
      //     <ErrorView
      //       title="로그인이 필요한 메뉴입니다."
      //       msg="로그인 후 이용해주세요. 회원이 아니라면 회원가입을 해주세요."
      //       buttons={
      //         <div>
      //           <Link to="/sign-up">
      //             <button className="btn btn-grey" style={{ marginRight: '4px' }}>
      //               <i className="ace-icon fa fa-pencil-square-o"></i> 회원가입
      //             </button>
      //           </Link>
      //           <a href="" onClick={this._showLoginModal}>
      //             <button className="btn btn-primary">
      //               <i className="ace-icon fa fa-key"></i> 로그인
      //             </button>
      //           </a>
      //         </div>
      //       }
      //     />
      //   )
      // } else {
      //   returnComponent = <ComposedComponent {...this.props} />
      // }
      // return returnComponent
    }
  }

  // HeaderWrapper.contextTypes = {
  //   router: PropTypes.object
  // }

  // const mapStateToProps = (store) => {
  //   return { authUser: store.authUser }
  // }

  HeaderWrapper.propTypes = {
    authUser: PropTypes.object
  }

  return HeaderWrapper
}
