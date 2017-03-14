import React, { PropTypes } from 'react'
import { convertDateToString, extractDaysFromLessonDays } from 'common/util'

class LessonDateInfo extends React.Component {
  render () {
    const lesson = this.props.lesson
    if (lesson.oneday) {
      return (
        <span>오는 <span className='text-default'>{convertDateToString(lesson.lessonDate)}</span>에 진행되는 <span className='text-default'>원데이레슨</span></span>
      )
    } else {
      return (
        <span>
          오는 <span className='text-default'>{convertDateToString(lesson.lessonDate)}</span>부터 <span className='text-default'>{`${lesson.weekType} ${extractDaysFromLessonDays(lesson.lessonDays)}요일`}</span>에 <span className='text-default'>{lesson.weekLong}주간</span> 진행
        </span>
      )
    }
  }
}

LessonDateInfo.propTypes = {
  lesson: PropTypes.object.isRequired
}

export default LessonDateInfo
