import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import Button from 'components/Button'

class TableList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      process: false
    }
    this._handleOnClickMoreList = this._handleOnClickMoreList.bind(this)
  }
  _handleOnClickMoreList () {
    this.setState({ process: true })
    this.props.onClickMoreBtn()
    .then(() => {
      this.setState({ process: false })
    })
  }
  render () {
    const renderHeaders = () => {
      return this.props.headers.map(header => {
        return <th className='text-center'>{header}</th>
      })
    }
    const renderElements = () => {
      const { elements, aligns, hideForMobile } = this.props
      return elements.map(element => {
        const renderElement = () => {
          let idx = -1
          const align = () => {
            return aligns ? `text-${aligns[idx]}` : 'text-center'
          }
          const hide = () => {
            return hideForMobile && hideForMobile[idx] ? 'hidden-xs' : ''
          }
          return element.map(elem => {
            idx++
            return (
              <td className={`${align()} ${hide()}`}>
                {elem}
              </td>
            )
          })
        }
        return (
          <tr>
            {renderElement()}
          </tr>
        )
      })
    }
    const renderMoreButton = () => {
      if (this.props.restElements !== 0) {
        return (
          <tr>
            <td colSpan={this.props.headers.length}>
              <Button
                className='btn-block'
                onClick={this._handleOnClickMoreList}
                process={this.state.process}
                square
                color='gray'
                textComponent={
                  <span>
                    <i className='fa fa-angle-down' /> <span className='text-default'>
                      {this.props.restElements}</span>건 더 보기
                  </span>
                }
              />
            </td>
          </tr>
        )
      }
    }
    const renderContent = () => {
      let returnComponent = null
      if (!this.props.elements) {
        returnComponent = <Loading text='정보를 불러오는 중..' />
      } else {
        returnComponent = (
          <table className='table cart table-hover table-colored'>
            <thead>
              <tr>
                {renderHeaders()}
              </tr>
            </thead>
            <tbody>
              {renderElements()}
              {renderMoreButton()}
            </tbody>
          </table>
        )
      }
      return returnComponent
    }
    return (
      <div>
        {renderContent()}
      </div>
    )
  }
}

TableList.contextTypes = {
  router: PropTypes.object.isRequired
}

TableList.propTypes = {
  headers: PropTypes.array.isRequired,
  elements: PropTypes.array, // 2중 배열로 구성
  hideForMobile: PropTypes.array,
  aligns: PropTypes.array,
  emptyMesssage: PropTypes.string,
  onClickMoreBtn: PropTypes.func.isRequired, // Promise
  restElements: PropTypes.number.isRequired
}

export default TableList
