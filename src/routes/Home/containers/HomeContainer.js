import { connect } from 'react-redux'
import { fetchMainBanners } from '../modules/home'
import { fetchLessons } from 'store/lesson'

import HomeView from '../components/HomeView'

const mapDispatchToProps = {
  fetchMainBanners,
  fetchLessons
}

const mapStateToProps = (state) => ({
  mainBanners : state.home.mainBanners,
  lessons: state.lesson.lessonList
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
