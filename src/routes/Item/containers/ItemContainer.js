import { connect } from 'react-redux'
import { fetchLesson, unselectLesson } from 'store/lesson'
import { fetchProduct, unselectProduct } from 'store/product'
import { fetchCartsByUserId } from 'store/cart'
import { receiveOrderItem } from 'store/order'
import { fetchReviewsByGroupName, clearReviews,
  fetchItemInquiriesByGroupName, clearItemInquiries,
  appendReviewsByGroupName, appendItemInquiriesByGroupName, fetchRelatedItems } from '../modules/item'
import { fetchUserByUserId } from 'store/user'
import { setMessageModalShow, setMessageModal } from 'store/messageModal'
import { setInquiryModal } from 'store/inquiry'

import ItemView from '../components/ItemView'

const mapDispatchToProps = {
  fetchLesson,
  unselectLesson,
  fetchReviewsByGroupName,
  clearReviews,
  appendReviewsByGroupName,
  fetchItemInquiriesByGroupName,
  clearItemInquiries,
  appendItemInquiriesByGroupName,
  fetchRelatedItems,
  fetchProduct,
  unselectProduct,
  fetchCartsByUserId,
  receiveOrderItem,
  fetchUserByUserId,
  setMessageModalShow,
  setMessageModal,
  setInquiryModal
}

const mapStateToProps = (state) => ({
  item: state.lesson.selected || state.product.selected,
  reviews: state.item.reviews,
  inquiries: state.item.inquiries,
  user: state.user,
  relatedItems: state.item.relatedItems,
  carts: state.cart.cartList,
  isAdmin: state.authUser.data &&
    state.authUser.data.authorities.filter((data) => data.authority === 'ADMIN').length > 0
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemView)
