import { connect } from 'react-redux'
import { fetchLesson, unselectLesson } from 'store/lesson'
import { fetchReviewsByGroupName, clearReviews,
  fetchInquiriesByGroupName, clearInquiries,
  appendReviewsByGroupName, appendInquiriesByGroupName, fetchRelatedItems } from '../modules/item'

import ItemView from '../components/ItemView'

const mapDispatchToProps = {
  fetchLesson,
  unselectLesson,
  fetchReviewsByGroupName,
  clearReviews,
  appendReviewsByGroupName,
  fetchInquiriesByGroupName,
  clearInquiries,
  appendInquiriesByGroupName,
  fetchRelatedItems
}

const mapStateToProps = (state) => ({
  item: state.lesson.selected,
  reviews: state.item.reviews,
  inquiries: state.item.inquiries,
  user: state.user,
  relatedItems: state.item.relatedItems
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemView)
