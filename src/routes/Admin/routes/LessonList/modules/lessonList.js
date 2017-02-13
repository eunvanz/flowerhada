import axios from 'axios'
import { API_BASE_URL } from 'common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_LESSONS = 'RECEIVE_LESSONS'
export const CLEAR_LESSONS = 'CLEAR_LESSONS'

// ------------------------------------
// Actions
// ------------------------------------

export function receiveLesson (lessons = []) {
  return {
    type: RECEIVE_LESSONS,
    payload: lessons
  }
}

export const fetchLessons = (id) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/lessons/`)
    .then(res => {
      return dispatch(receiveLesson(res.data))
    })
  }
}

export function clearLessons () {
  return {
    type: CLEAR_LESSONS,
    payload: []
  }
}

export const actions = {
  fetchLessons,
  clearLessons
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_LESSONS] : (state, action) => {
    return action.payload
  },
  [CLEAR_LESSONS] : (state, action) => {
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
