import { connect } from 'react-redux'
import { fetchAllInquiries, appendAllInquiries, setInquiryModalShow, setInquiryModal } from 'store/inquiry'
import { setMessageModalShow, setMessageModal } from 'store/messageModal'

import InquiryListView from '../components/InquiryListView'

const mapDispatchToProps = {
  fetchAllInquiries,
  appendAllInquiries,
  setInquiryModalShow,
  setInquiryModal,
  setMessageModalShow,
  setMessageModal
}

const mapStateToProps = (state) => ({
  inquiries: state.inquiry.inquiryList
})

export default connect(mapStateToProps, mapDispatchToProps)(InquiryListView)
