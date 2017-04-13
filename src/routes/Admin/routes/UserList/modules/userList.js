import axios from 'axios'
import { API_BASE_URL } from 'common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_USERS = 'RECEIVE_USERS'
const CLEAR_USERS = 'CLEAR_USERS'
const APPEND_USERS = 'APPEND_USERS'

// ------------------------------------
// Actions
// ------------------------------------

export function receiveUsers (users = null) {
  return {
    type: RECEIVE_USERS,
    payload: users
  }
}

export function appendUsers (users = null) {
  return {
    type: APPEND_USERS,
    payload: users
  }
}

export const fetchUsers = (curPage, perPage) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/users/all?curPage=${curPage}&perPage=${perPage}`)
    .then(res => {
      return dispatch(receiveUsers(res.data))
    })
  }
}

export const fetchAndAppendUsers = (curPage, perPage) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/users/all?curPage=${curPage}&perPage=${perPage}`)
    .then(res => {
      return dispatch(appendUsers(res.data))
    })
  }
}

export function clearUsers () {
  return {
    type: CLEAR_USERS,
    payload: null
  }
}

export const actions = {
  fetchUsers,
  clearUsers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_USERS] : (state, action) => {
    return action.payload
  },
  [CLEAR_USERS] : (state, action) => {
    return action.payload
  },
  [APPEND_USERS] : (state, action) => {
    action.payload.content.forEach(element => {
      state.content.push(element)
    })
    action.payload.content = state.content
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
