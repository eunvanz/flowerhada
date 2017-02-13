import { connect } from 'react-redux'
import { fetchLesson, clearLesson } from '../modules/lessonRegister'

import LessonRegisterView from '../components/LessonRegisterView'

const mapDispatchToProps = {
  fetchLesson,
  clearLesson
}

const mapStateToProps = (state) => ({
  lesson : state.lessonRegister
})

export default connect(mapStateToProps, mapDispatchToProps)(LessonRegisterView)
