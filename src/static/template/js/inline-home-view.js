/* eslint-disable */
window.addEventListener('popstate', function() {
	if (location.pathname !== '/') $('#main-banner').revkill()
})
