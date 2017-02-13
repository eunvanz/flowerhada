import React from 'react'
import { Link } from 'react-router'

class LessonListView extends React.Component {
  componentDidMount () {
    this.props.fetchLessons()
  }
  render () {
    const renderList = () => {
      return this.props.lessonList.map(lesson => {
        return (
          <tr key={lesson.id}>
            <td>{lesson.id}</td>
            <td><Link to={`/admin/lesson/${lesson.id}`}>{lesson.title}</Link></td>
            <td>{lesson.detail}</td>
            <td>{lesson.mainCategory}</td>
            <td>{lesson.activated ? '활성' : '비활성'}</td>
            <td>{lesson.expired ? '만료' : '유효'}</td>
          </tr>
        )
      })
    }
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>설명</th>
              <th>카테고리</th>
              <th>활성</th>
              <th>만료</th>
            </tr>
          </thead>
          <tbody>
            {this.props.lessonList && this.props.lessonList.length > 0 && renderList()}
          </tbody>
        </table>
        <Link to='/admin/lesson/register'>
          <button className='btn btn-default'>레슨등록</button>
        </Link>
      </div>
    )
  }
}

LessonListView.propTypes = {
  lessonList: React.PropTypes.array.isRequired,
  fetchLessons: React.PropTypes.func.isRequired
}

export default LessonListView
