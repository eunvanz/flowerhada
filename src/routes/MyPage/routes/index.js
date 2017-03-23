import MyPageLayout from 'layouts/MyPageLayout/MyPageLayout'
import Profile from './Profile'
import OrderList from './OrderList'
import PointHistory from './PointHistory'

export const createRoutes = (store) => ({
  path        : 'my-page',
  component   : MyPageLayout,
  indexRoute  : Profile(store),
  childRoutes : [
    Profile(store),
    OrderList(store),
    PointHistory(store)
  ]
})

export default createRoutes
