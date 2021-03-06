// We only need to import the modules necessary for initial render
import AdminLayout from 'layouts/AdminLayout/AdminLayout'
import MainBannerList from './MainBannerList'
import MainBannerRegister from './MainBannerRegister'
import AdminHome from './AdminHome'
import LessonList from './LessonList'
import LessonRegister from './LessonRegister'
import ProductList from './ProductList'
import ProductRegister from './ProductRegister'
import OrderList from './OrderList'
import ErrorList from './ErrorList'
import InquiryList from './InquiryList'
import UserList from './UserList'
import TutorList from './TutorList'
import TutorRegister from './TutorRegister'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : 'admin',
  component   : AdminLayout,
  indexRoute  : AdminHome,
  childRoutes : [
    MainBannerRegister(store),
    MainBannerList(store),
    LessonList(store),
    LessonRegister(store),
    ProductList(store),
    ProductRegister(store),
    OrderList(store),
    ErrorList(store),
    InquiryList(store),
    UserList(store),
    TutorRegister(store),
    TutorList(store)
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
