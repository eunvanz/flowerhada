import { getAllLessons, getLesson } from 'common/LessonService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_LESSONS = 'RECEIVE_LESSONS'
export const SELECT_LESSON = 'SELECT_LESSON'
export const UNSELECT_LESSON = 'UNSELECT_LESSON'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveLessons (lessons = []) {
  return {
    type    : RECEIVE_LESSONS,
    payload : { lessonList: lessons }
  }
}

export function selectLesson (lesson = null) {
  return {
    type: SELECT_LESSON,
    payload: { selected: lesson }
  }
}

export function unselectLesson () {
  return {
    type: UNSELECT_LESSON,
    payload: { selected: null }
  }
}

export const fetchLessons = () => {
  return dispatch => {
    return getAllLessons()
    .then(res => {
      return dispatch(receiveLessons(res.data))
    })
  }
}

export const fetchLesson = id => {
  return dispatch => {
    return getLesson(id)
    .then(res => {
      return dispatch(selectLesson(res.data))
    })
  }
}

export const actions = {
  fetchLessons,
  fetchLesson
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_LESSONS] : (state, action) => {
    return Object.assign({}, ...state, action.payload)
  },
  [SELECT_LESSON] : (state, action) => {
    return Object.assign({}, ...state, action.payload)
  },
  [UNSELECT_LESSON] : (state, action) => {
    return Object.assign({}, ...state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { lessonList: [], selected: null }
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
