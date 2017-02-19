import { connect } from 'react-redux'
import { fetchMainBanners } from '../modules/home'
import { fetchLessons } from 'store/lesson'
import { fetchProducts } from 'store/product'

import HomeView from '../components/HomeView'

const mapDispatchToProps = {
  fetchMainBanners,
  fetchLessons,
  fetchProducts
}

const mapStateToProps = (state) => ({
  mainBanners : state.home.mainBanners,
  lessons: state.lesson.lessonList,
  products: state.product.productList
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
