import React from 'react'
import { Link } from 'react-router'
import { imgRoute } from '../../../common/constants'
import { isScreenSize } from 'common/util'

class HomeCard extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'HomeCard'
  }
  render () {
    return (
      <div className='col-sm-6 col-md-3' style={{ padding: isScreenSize.xs() ? '0px' : '0px 20px' }}>
        <div className='pv-30 ph-20 feature-box bordered
          shadow text-center object-non-visible animated object-visible fadeInDownSmall'
          data-animation-effect='fadeInDownSmall' data-effect-delay='100'>
          <span className={`icon ${this.props.img ? 'white-bg' : 'default-bg'} circle`} style={{ paddingTop: '2px' }}>
            {this.props.img && <img src={`${imgRoute}/${this.props.img}`} width='60px' height='60px' />}
            {this.props.icon && <i className={`text-white ${this.props.icon}`} />}
          </span>
          <h3>{this.props.title}</h3>
          <div className='separator clearfix' />
          <p>
            {this.props.content}
          </p>
          <Link to={`${this.props.link}`}>
            더 보기 <i className='pl-5 fa fa-angle-double-right' />
          </Link>
        </div>
      </div>
    )
  }
}

HomeCard.propTypes = {
  img: React.PropTypes.string,
  icon: React.PropTypes.string,
  actionName: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
  link: React.PropTypes.string.isRequired
}

export default HomeCard
