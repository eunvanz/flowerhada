import { connect } from 'react-redux'
import { fetchUser } from 'store/user'
import { receiveAuthUser } from 'store/authUser'
import { setInquiryModalShow } from 'store/inquiry'

import CoreLayout from './CoreLayout'

const mapDispatchToProps = {
  fetchUser,
  receiveAuthUser,
  setInquiryModalShow
}

const mapStateToProps = state => ({
  inquiryModal: state.inquiry.inquiryModal,
  user: state.user
})

export default connect(mapDispatchToProps, mapStateToProps)(CoreLayout)
