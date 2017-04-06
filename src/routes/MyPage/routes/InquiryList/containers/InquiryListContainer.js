import { connect } from 'react-redux'
import { fetchInquiriesByUserId, appendInquiriesByUserId, setInquiryModal } from 'store/inquiry'
import { setMessageModal, setMessageModalShow } from 'store/messageModal'

import InquiryListView from '../components/InquiryListView'

const mapDispatchToProps = {
  fetchInquiriesByUserId,
  appendInquiriesByUserId,
  setInquiryModal,
  setMessageModal,
  setMessageModalShow
}

const mapStateToProps = (state) => ({
  user: state.user,
  inquiries: state.inquiry.inquiryList
})

export default connect(mapStateToProps, mapDispatchToProps)(InquiryListView)
