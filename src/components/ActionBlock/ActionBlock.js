import React from 'react'

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
                    <button className='btn btn-lg btn-gray-transparent btn-animated' onClick={this.props.onClick}>
                      {this.props.btnTxt}
                      <i className={this.props.btnIcon} />
                    </button>
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
  onClick: React.PropTypes.func.isRequired,
  btnTxt: React.PropTypes.string.isRequired,
  btnIcon: React.PropTypes.string.isRequired
}

export default ActionBlock
