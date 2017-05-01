// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_NAVER_LOGIN = 'RECEIVE_NAVER_LOGIN'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveNaverLogin (login = null) {
  return {
    type    : RECEIVE_NAVER_LOGIN,
    payload : { login }
  }
}

export function setNaverLogin (login) {
  return dispatch => {
    return dispatch(receiveNaverLogin(login))
  }
}

export const actions = {
  receiveNaverLogin,
  setNaverLogin
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_NAVER_LOGIN] : (state, action) => {
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { login: null }
export default function naverReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
