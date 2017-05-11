// We only need to import the modules necessary for initial render
import NewsLayout from 'layouts/NewsLayout/NewsLayout'
import NewsList from './NewsList'
import NewsRegister from './NewsRegister'
import NewsDetail from './NewsDetail'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : 'news',
  component   : NewsLayout,
  indexRoute  : NewsList(store),
  childRoutes : [
    NewsList(store),
    NewsRegister(store),
    NewsDetail(store)
  ]
})

export default createRoutes
