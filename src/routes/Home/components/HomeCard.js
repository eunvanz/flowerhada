import React from 'react'
import { Link } from 'react-router'
import { imgRoute } from '../../../common/constants'

class HomeCard extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'HomeCard'
  }
  // render () {
  //   return (
  //     <div className='col-md-4'>
  //       <div className='image-box style-2 mb-20 shadow bordered light-gray-bg text-center'>
  //         <div className='overlay-container'>
  //           <img src={`${imgRoute}/${this.props.img}`} />
  //           <div className='overlay-to-top'>
  //             <p className='margin-clear'>
  //               <em>{this.props.actionName}</em>
  //             </p>
  //           </div>
  //         </div>
  //         <div className='body'>
  //           <h3>{this.props.title}</h3>
  //           <div className='separator' />
  //           <p>
  //             {this.props.content}
  //           </p>
  //           <Link to={`/${this.props.link}`}>
  //             <button className='btn btn-default btn-sm btn-hvr hvr-shutter-out-horizontal margin-clear'>
  //               더 보기 <i className='fa fa-arrow-right pl-10' />
  //             </button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  render () {
    return (
      <div className='col-md-4'>
        <div className='pv-30 ph-20 feature-box bordered
          shadow text-center object-non-visible animated object-visible fadeInDownSmall'
          data-animation-effect='fadeInDownSmall' data-effect-delay='100'>
          <span className='icon white-bg circle'>
            <img src={`${imgRoute}/${this.props.img}`} width='60px' height='60px' />
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
  img: React.PropTypes.string.isRequired,
  actionName: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
  link: React.PropTypes.string.isRequired
}

export default HomeCard
