import { connect } from 'react-redux'

import InquiryView from '../components/InquiryView'

const mapStateToProps = (state) => {
  return ({
    user: state.user,
    inquiry: state.inquiry.selected
  })
}

export default connect(mapStateToProps)(InquiryView)
