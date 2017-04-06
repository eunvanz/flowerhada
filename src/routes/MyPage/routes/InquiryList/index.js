export default (store) => ({
  path: 'inquiry-list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const InquiryList = require('./containers/InquiryListContainer').default
      cb(null, InquiryList)
    }, 'inquiry-list')
  }
})
