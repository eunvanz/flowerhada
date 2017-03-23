// We only need to import the modules necessary for initial render
import CoreLayout from 'layouts/CoreLayout'
import Home from './Home'
import SignUpRoute from './SignUp'
import LoginRoute from './Login'
import Admin from './Admin'
import Item from './Item'
import ItemList from './ItemList'
import NotFound from './NotFound'
import Cart from './Cart'
import OrderComplete from './OrderComplete'
import MyPage from './MyPage'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute  : Home(store),
  childRoutes : [
    SignUpRoute(store),
    LoginRoute(store),
    Admin(store),
    Item(store),
    ItemList(store),
    Cart(store),
    OrderComplete(store),
    MyPage(store),
    // 이곳에 추가해야 함
    NotFound(store)
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
