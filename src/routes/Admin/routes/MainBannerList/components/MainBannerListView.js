import React from 'react'
import { Link } from 'react-router'

class MainBannerListView extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'MainBannerListView'
    // this.state = {
    //   state: null
    // }
  }
  componentDidMount () {
    this.props.fetchMainBanners()
  }
  render () {
    const renderList = () => {
      const returnComponent = []
      for (const banner of this.props.bannerList) {
        returnComponent.push(
          <tr key={banner.id}>
            <td>{banner.id}</td>
            <td><Link to={`/admin/main-banner/${banner.id}`}>{banner.shortTitle}</Link></td>
            <td>{banner.activated ? '활성' : '비활성'}</td>
          </tr>
        )
      }
      return returnComponent
    }
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {this.props.bannerList.length > 0 && renderList()}
          </tbody>
        </table>
        <Link to='/admin/main-banner/register'><button className='btn btn-default'>배너등록</button></Link>
      </div>
    )
  }
}

MainBannerListView.propTypes = {
  bannerList: React.PropTypes.array.isRequired,
  fetchMainBanners: React.PropTypes.func.isRequired
}

export default MainBannerListView
