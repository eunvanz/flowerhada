import { connect } from 'react-redux'
import { fetchLessons, fetchLessonsByMainCategory } from 'store/lesson'

import ItemListView from '../components/ItemListView'

const mapDispatchToProps = {
  fetchLessons,
  fetchLessonsByMainCategory
}

const mapStateToProps = (state) => ({
  items: state.lesson.lessonList
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemListView)
