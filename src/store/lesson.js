import { getAllLessons, getLesson, getLessonByMainCategory } from 'common/LessonService'
import { checkExpiredLesson } from 'common/util'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_LESSONS = 'RECEIVE_LESSONS'
export const SELECT_LESSON = 'SELECT_LESSON'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveLessons (lessons = null) {
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
  return dispatch => {
    return dispatch(selectLesson(null))
  }
}

export const fetchLessons = () => {
  return dispatch => {
    return getAllLessons()
    .then(res => {
      const lessons = res.data
      const checkedLessons = lessons.map(lesson => checkExpiredLesson(lesson))
      return dispatch(receiveLessons(checkedLessons))
    })
  }
}

export const fetchLesson = id => {
  return dispatch => {
    return getLesson(id)
    .then(res => {
      const lesson = res.data
      const checkedLesson = checkExpiredLesson(lesson)
      return dispatch(selectLesson(checkedLesson))
    })
  }
}

export const fetchLessonsByMainCategory = mainCategory => {
  return dispatch => {
    return getLessonByMainCategory(mainCategory)
    .then(res => {
      const lessons = res.data
      const checkedLessons = lessons.map(lesson => checkExpiredLesson(lesson))
      return dispatch(receiveLessons(checkedLessons))
    })
  }
}

export const clearLessons = () => {
  return dispatch => {
    return dispatch(receiveLessons(null))
  }
}

export const actions = {
  fetchLessons,
  fetchLesson,
  fetchLessonsByMainCategory,
  unselectLesson,
  clearLessons
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_LESSONS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [SELECT_LESSON] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { lessonList: null, selected: null }
export default function lessonReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
