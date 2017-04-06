import { connect } from 'react-redux'
import { fetchMainBanners } from '../modules/home'
import { fetchLessons } from 'store/lesson'
import { fetchProducts } from 'store/product'
import { setInquiryModalShow, setInquiryModalInquiry,
  setInquiryModalDefaultCategory, setInquiryModalMode, setInquiryModalAfterSubmit } from 'store/inquiry'
import { setMessageModalShow, setMessageModalMessage, setMessageModalCancelBtnTxt, setMessageModalConfirmBtnTxt,
  setMessageModalOnConfirmClick } from 'store/messageModal'

import HomeView from '../components/HomeView'

const mapDispatchToProps = {
  fetchMainBanners,
  fetchLessons,
  fetchProducts,
  setInquiryModalShow,
  setInquiryModalInquiry,
  setInquiryModalDefaultCategory,
  setInquiryModalMode,
  setInquiryModalAfterSubmit,
  setMessageModalShow,
  setMessageModalMessage,
  setMessageModalCancelBtnTxt,
  setMessageModalConfirmBtnTxt,
  setMessageModalOnConfirmClick
}

const mapStateToProps = (state) => ({
  mainBanners : state.home.mainBanners,
  lessons: state.lesson.lessonList,
  products: state.product.productList,
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
