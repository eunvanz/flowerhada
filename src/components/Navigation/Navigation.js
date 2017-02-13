import React from 'react'
import { Link } from 'react-router'

class Navigation extends React.Component {
  render () {
    const currentRouteName = location.pathname
    const _renderTabs = () => {
      const tabTitles = this.props.tabTitles
      const tabIcons = this.props.tabIcons
      const tabLinks = this.props.tabLinks
      const returnComponent = []
      for (let i = 0; i < tabTitles.length; i++) {
        returnComponent.push(
          <li className={currentRouteName.indexOf(tabLinks[i]) !== -1 ? 'active' : ''} key={i}>
            <Link to={tabLinks[i]}><i className={tabIcons[i]} />{tabTitles[i]}</Link>
          </li>
        )
      }
      return returnComponent
    }
    return (
      <div>
        <ul className='nav nav-pills'>
          {_renderTabs()}
        </ul>
      </div>
    )
  }
}

Navigation.propTypes = {
  tabTitles: React.PropTypes.array.isRequired,
  tabIcons: React.PropTypes.array.isRequired,
  tabLinks: React.PropTypes.array.isRequired
}

export default Navigation
