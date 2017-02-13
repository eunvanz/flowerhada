import axios from 'axios'
import { API_BASE_URL } from 'common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_LESSON = 'RECEIVE_LESSON'
export const CLEAR_LESSON = 'CLEAR_LESSON'

// ------------------------------------
// Actions
// ------------------------------------

export function receiveLesson (lesson = null) {
  return {
    type: RECEIVE_LESSON,
    payload: lesson
  }
}

export const fetchLesson = (id) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/lessons/${id}`)
    .then(res => {
      return dispatch(receiveLesson(res.data))
    })
  }
}

export function clearLesson () {
  return {
    type: CLEAR_LESSON,
    payload: null
  }
}

export const actions = {
  fetchLesson,
  clearLesson
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_LESSON] : (state, action) => {
    return action.payload
  },
  [CLEAR_LESSON] : (state, action) => {
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
