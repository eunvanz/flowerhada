import React, { PropTypes } from 'react'
import Loading from 'components/Loading'
import { convertSqlDateToStringDateOnly } from 'common/util'
import Button from 'components/Button'
import { increaseBoardView, deleteBoardById } from 'common/BoardService'

class NewsDetailView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      process: false
    }
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
  }
  componentDidMount () {
    const { id } = this.props.params
    this.props.fetchBoard(id)
    .then(() => {
      increaseBoardView(id)
    })
  }
  componentWillUnmount () {
    this.props.unselectBoard()
  }
  _handleOnClickDelete () {
    this.setState({ process: true })
    deleteBoardById(this.props.params.id)
    .then(() => {
      this.context.router.push('/news')
    })
  }
  render () {
    const renderBodyComponent = () => {
      return <div dangerouslySetInnerHTML={{ __html: this.props.news.content }} />
    }
    if (this.props.news) {
      return (
        <article className='blogpost'>
          <header>
            <h2>{this.props.news.title}</h2>
            <div className='post-info'>
              <span className='post-date'>
                <i className='icon-calendar' />{convertSqlDateToStringDateOnly(this.props.news.regDate)}
              </span>
              <span className='submitted'>
                <i className='icon-user-1' />by 꽃하다
              </span>
              {/* <span className='comments'>
                <i className='fa fa-eye' /> {this.props.news.view + 1} views
              </span> */}
            </div>
          </header>
          <div className='blogpost-content'>{renderBodyComponent()}</div>
          <footer className='clearfix'>
            {
              this.props.isAdmin &&
              <Button textComponent={<span>삭제</span>}
                process={this.state.process} onClick={this._handleOnClickDelete} />
            }
            {
              this.props.isAdmin &&
              <Button textComponent={<span>수정</span>}
                onClick={() => this.context.router.push(`/news/register/${this.props.news.id}`)}
              />
            }
            <Button className='pull-right'
              textComponent={<span>목록으로</span>}
              onClick={() => this.context.router.push('/news')} />
          </footer>
        </article>
      )
    } else {
      return <Loading text='뉴스를 불러오는 중...' />
    }
  }
}

NewsDetailView.contextTypes = {
  router: PropTypes.object.isRequired
}

NewsDetailView.propTypes = {
  fetchBoard: PropTypes.func.isRequired,
  unselectBoard: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  news: PropTypes.object,
  params: PropTypes.object
}

export default NewsDetailView
