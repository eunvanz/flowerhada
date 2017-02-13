import React from 'react'
import { Link } from 'react-router'

class ActionBlock extends React.Component {
  render () {
    return (
      <div className='section default-bg clearfix'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='call-to-action text-center'>
                <div className='row'>
                  <div className='col-sm-8'>
                    <h1 className='title'>{this.props.title}</h1>
                    <p>{this.props.desc}</p>
                  </div>
                  <div className='col-sm-4'>
                    <Link to={this.props.link}>
                      <button className='btn btn-lg btn-gray-transparent btn-animated'>
                        {this.props.btnTxt}
                        <i className={this.props.btnIcon} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ActionBlock.propTypes = {
  title: React.PropTypes.string.isRequired,
  desc: React.PropTypes.string.isRequired,
  link: React.PropTypes.string.isRequired,
  btnTxt: React.PropTypes.string.isRequired,
  btnIcon: React.PropTypes.string.isRequired
}

export default ActionBlock
