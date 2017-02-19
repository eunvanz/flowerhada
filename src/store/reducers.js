import { combineReducers } from 'redux'
import locationReducer from './location'
import authUserReducer from './authUser'
import userReducer from './user'
import lessonReducer from './lesson'
import productReducer from './product'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    authUser: authUserReducer,
    user: userReducer,
    lesson: lessonReducer,
    product: productReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
