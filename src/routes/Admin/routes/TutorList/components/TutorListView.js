import React, { PropTypes } from 'react'
import { getAllTutors } from 'common/TutorService'
import Button from 'components/Button'
import { Link } from 'react-router'

class TutorListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tutors: []
    }
  }
  componentDidMount () {
    getAllTutors()
    .then(res => {
      const tutors = res.data
      this.setState({ tutors })
    })
  }
  render () {
    const renderTutorList = () => {
      return this.state.tutors.map(tutor => {
        return (
          <tr key={tutor.id}>
            <td>{tutor.id}</td>
            <td><Link to={`/admin/tutor/${tutor.id}`}>{tutor.name}</Link></td>
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
              <th>이름</th>
            </tr>
          </thead>
          <tbody>
            {renderTutorList()}
          </tbody>
        </table>
        <Button
          textComponent={<span>강사등록</span>}
          onClick={() => this.context.router.push('/admin/tutor/register')}
        />
      </div>
    )
  }
}

TutorListView.contextTypes = {
  router: PropTypes.object.isRequired
}

TutorListView.propTypes = {

}

export default TutorListView
