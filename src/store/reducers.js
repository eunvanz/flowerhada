import { combineReducers } from 'redux'
import locationReducer from './location'
import authUserReducer from './authUser'
import userReducer from './user'
import lessonReducer from './lesson'
import productReducer from './product'
import cartReducer from './cart'
import orderReducer from './order'
import inquiryReducer from './inquiry'
import messageModalReducer from './messageModal'
import socialReducer from './social'
import boardReducer from './board'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    authUser: authUserReducer,
    user: userReducer,
    lesson: lessonReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    inquiry: inquiryReducer,
    messageModal: messageModalReducer,
    social: socialReducer,
    board: boardReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
