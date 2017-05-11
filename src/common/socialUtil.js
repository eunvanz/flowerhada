import { getUserByEmailAndSocialType, signUp } from 'common/UserService'
import { SOCIAL_PASSWORD, FACEBOOK_APP_ID } from 'common/constants'

export const Facebook = {
  init: () => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v2.9'
      })
    }
    (function (d, s, id) {
      var js
      var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  },
  login: (loginProcess) => {
    const FB = window.FB
    FB.login(response => {
      if (response.status === 'connected') {
        FB.api('/me', { fields: 'email,picture,name' }, response => {
          const email = response.email
          const name = response.name
          const image = response.picture.data.url
          getUserByEmailAndSocialType(email, 'facebook')
          .then(res => {
            const { data } = res
            if (data && data !== '') {
              // console.log('로그인처리')
              // 로그인처리
              const userInfo = { email, password: SOCIAL_PASSWORD, image, name }
              loginProcess(userInfo, 'facebook')
            } else {
              // console.log('회원가입처리')
              // 회원가입처리
              const userInfo = {
                email,
                password: SOCIAL_PASSWORD,
                name,
                image,
                socialType: 'facebook'
              }
              // console.log('userInfo', userInfo)
              signUp(userInfo)
              .then((res) => {
                loginProcess(userInfo, 'facebook')
              })
            }
          })
        })
      }
    }, { scope: 'email,public_profile' })
  }
}
