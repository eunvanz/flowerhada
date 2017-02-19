import { connect } from 'react-redux'
import { fetchLessons, fetchLessonsByMainCategory, clearLessons } from 'store/lesson'
import { fetchProductsByMainCategory, clearProducts, fetchProductsBySubCategory } from 'store/product'

import ItemListView from '../components/ItemListView'

const mapDispatchToProps = {
  fetchLessons,
  fetchLessonsByMainCategory,
  fetchProductsByMainCategory,
  fetchProductsBySubCategory,
  clearLessons,
  clearProducts
}

const mapStateToProps = (state) => ({
  lessonList: state.lesson.lessonList,
  productList: state.product.productList
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemListView)
