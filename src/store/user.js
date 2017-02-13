import { getUserByEmail } from '../common/UserService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_USER = 'RECEIVE_USER'
export const REMOVE_USER = 'REMOVE_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveUser (user = null) {
  return {
    type    : RECEIVE_USER,
    payload : user
  }
}

export const fetchUser = email => {
  return dispatch => {
    return getUserByEmail(email)
    .then(res => {
      return dispatch(receiveUser(res.data))
    })
  }
}

export function removeUser (user = null) {
  return {
    type    : RECEIVE_USER,
    payload : null
  }
}

export const actions = {
  fetchUser,
  removeUser
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_USER] : (state, action) => {
    return action.payload
  },
  [REMOVE_USER] : (state, action) => {
    return null
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
