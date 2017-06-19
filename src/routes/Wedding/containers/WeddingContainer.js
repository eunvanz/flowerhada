import { connect } from 'react-redux'
import { setMessageModalShow, setMessageModal } from 'store/messageModal'
import { setInquiryModal } from 'store/inquiry'

import WeddingView from '../components/WeddingView'

const mapDispatchToProps = {
  setMessageModal,
  setMessageModalShow,
  setInquiryModal
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(WeddingView)
