import { login, socialLogin, getUserByEmailAndSocialType } from '../common/UserService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_AUTH_USER = 'RECEIVE_AUTH_USER'
export const REMOVE_AUTH_USER = 'REMOVE_AUTH_USER'
export const LOAD_AUTH_USER = 'LOAD_AUTH_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveAuthUser (authUser = null) {
  return {
    type    : RECEIVE_AUTH_USER,
    payload : { isLoading: false, data: authUser }
  }
}

export function loadAuthUser () {
  return {
    type    : LOAD_AUTH_USER,
    payload : { isLoading: true, data: null }
  }
}

export const fetchAuthUser = (email, password) => {
  return dispatch => {
    return getUserByEmailAndSocialType(email, null)
    .then(res => {
      let { data } = res
      // console.log('res', res)
      // console.log('password', password)
      // console.log('data', data)
      data.password = password
      return login(data)
    })
    .then(res => {
      return dispatch(receiveAuthUser(res.data))
    })
  }
}

export const fetchSocialAuthUser = (email, password, socialType) => {
  return dispatch => {
    return getUserByEmailAndSocialType(email, socialType)
    .then(res => {
      let { data } = res
      data.password = password
      return socialLogin(data, socialType)
    })
    .then(res => {
      return dispatch(receiveAuthUser(res.data))
    })
  }
}

export function removeAuthUser () {
  return {
    type    : REMOVE_AUTH_USER,
    payload : { isLoading: false, data: null }
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */

// export const fetchToken = () => {
//   return (dispatch, getState) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         dispatch(receiveAuthUser(getState().counter))
//         resolve()
//       }, 200)
//     })
//   }
// }

export const actions = {
  receiveAuthUser,
  fetchAuthUser,
  removeAuthUser
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_AUTH_USER] : (state, action) => {
    return action.payload
  },
  [REMOVE_AUTH_USER] : (state, action) => {
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { isLoading: false, data: null }
export default function authUserReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
