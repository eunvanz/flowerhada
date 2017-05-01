/* eslint-disable */
window.addEventListener('popstate', function() {
	if (location.pathname !== '/') $('#main-banner').revkill()
})

// function naverSignInCallback() {
// 	// naver_id_login.getProfileData('프로파일항목명');
// 	// 프로필 항목은 개발가이드를 참고하시기 바랍니다.
// 	alert(naver_id_login.getProfileData('email'));
// 	alert(naver_id_login.getProfileData('nickname'));
// 	alert(naver_id_login.getProfileData('age'));
// }
