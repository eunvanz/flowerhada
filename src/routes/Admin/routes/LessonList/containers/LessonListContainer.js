import { connect } from 'react-redux'
import { fetchLessons } from 'store/lesson'

import LessonListView from '../components/LessonListView'

const mapDispatchToProps = {
  fetchLessons
}

const mapStateToProps = (state) => ({
  lessonList : state.lesson.lessonList
})

export default connect(mapStateToProps, mapDispatchToProps)(LessonListView)
