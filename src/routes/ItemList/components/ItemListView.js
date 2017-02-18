import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import Navigation from 'components/Navigation'
import ItemList from 'components/ItemList'

class ItemListView extends React.Component {
  constructor (props) {
    super(props)
    this._loadItems = this._loadItems.bind(this)
  }
  componentDidMount () {
    this._loadItems()
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.fliter !== this.props.params.filter) {
      this._loadItems()
    }
  }
  _loadItems () {
    if (this.props.params.type === 'lesson') {
      if (this.props.params.filter === 'all') this.props.fetchLessons()
      else this.props.fetchLessonsByMainCategory(this.props.params.filter)
    }
  }
  render () {
    const renderTitle = () => {
      let returnComponent = null
      if (this.props.params.type === 'lesson') {
        returnComponent = <span>플라워레슨</span>
      }
      return returnComponent
    }
    const renderDescription = () => {
      let returnComponent = null
      if (this.props.params.type === 'lesson') {
        returnComponent = <span>hada만의 고품격 레슨으로 유러피언 스타일의 작품들을 직접 만들어보세요.</span>
      }
      return returnComponent
    }
    const tabTitles = ['전체', '원데이레슨', '취미반', '창업반']
    const tabIcons = ['fa fa-list', 'fa fa-check', 'fa fa-heart', 'fa fa-graduation-cap']
    const tabLinks = ['/item-list/lesson/all', '/item-list/lesson/원데이레슨',
      '/item-list/lesson/취미반', '/item-list/lesson/창업반']
    return (
      <div>
        <Parallax title={renderTitle()} description={renderDescription()} />
        <section className='main-container'>
          <div className='container'>
            <div className='row'>
              <div className='main col-md-12'>
                <Navigation
                  tabTitles={tabTitles}
                  tabIcons={tabIcons}
                  tabLinks={tabLinks}
                />
                {
                  this.props.items &&
                  <ItemList
                    items={this.props.items}
                    itemType={this.props.params.type}
                  />
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

ItemListView.propTypes = {
  items: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  fetchLessons: PropTypes.func.isRequired,
  fetchLessonsByMainCategory: PropTypes.func.isRequired
}

export default ItemListView
