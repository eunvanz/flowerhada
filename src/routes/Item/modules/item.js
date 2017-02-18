import { getCommentByGroupName } from 'common/CommentService'
import { getLessonByGroupName } from 'common/LessonService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS'
export const RECEIVE_REVIEW = 'RECEIVE_REVIEW'
export const CLEAR_REVIEWS = 'CLEAR_REVIEWS'
export const CLEAR_REVIEW = 'CLEAR_REVIEW'
export const APPEND_REVIEWS = 'APPEND_REVIEWS'
export const RECEIVE_INQUIRIES = 'RECEIVE_INQUIRIES'
export const CLEAR_INQUIRIES = 'CLEAR_INQUIRIES'
export const APPEND_INQUIRIES = 'APPEND_INQUIRIES'
export const RECEIVE_RECENT_ITEMS = 'RECEIVE_RECENT_ITEMS'
export const RECEIVE_RELATED_ITEMS = 'RECEIVE_RELATED_ITEMS'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveRecentItems (recentItems = null) {
  return {
    type: RECEIVE_RECENT_ITEMS,
    payload: { recentItems }
  }
}

export function receiveRelatedItems (relatedItems = null) {
  return {
    type: RECEIVE_RELATED_ITEMS,
    payload: { relatedItems }
  }
}

export function receiveReviews (reviews = null) {
  return {
    type: RECEIVE_REVIEWS,
    payload: { reviews }
  }
}

export function receiveInquiries (inquiries = null) {
  return {
    type: RECEIVE_INQUIRIES,
    payload: { inquiries }
  }
}

export function receiveReview (review = null) {
  return {
    type: RECEIVE_REVIEW,
    payload: { review }
  }
}

export function clearReview () {
  return {
    type: CLEAR_REVIEW,
    payload: { review: null }
  }
}

export function clearReviews () {
  return {
    type: CLEAR_REVIEWS,
    payload: { reviews: null }
  }
}

export function clearInquiries () {
  return {
    type: CLEAR_INQUIRIES,
    payload: { inquiries: null }
  }
}

export function appendReviews (reviews = null) {
  return {
    type: APPEND_REVIEWS,
    payload: { reviews }
  }
}

export function appendInquiries (inquiries = null) {
  return {
    type: APPEND_INQUIRIES,
    payload: { inquiries }
  }
}

export const fetchReviewsByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'review', curPage, perPage)
    .then(res => {
      return dispatch(receiveReviews(res.data))
    })
  }
}

export const fetchInquiriesByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'inquiry', curPage, perPage)
    .then(res => {
      return dispatch(receiveInquiries(res.data))
    })
  }
}

export const appendReviewsByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'review', curPage, perPage)
    .then(res => {
      return dispatch(appendReviews(res.data))
    })
  }
}

export const appendInquiriesByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'inquiry', curPage, perPage)
    .then(res => {
      return dispatch(appendInquiries(res.data))
    })
  }
}

export const fetchRelatedItems = (item, type) => {
  let service = null
  if (type === 'lesson') service = getLessonByGroupName
  return dispatch => {
    return service(item.groupName)
    .then(res => {
      const data = res.data.filter(elem => {
        return item.id !== elem.id
      })
      return dispatch(receiveRelatedItems(data))
    })
  }
}

export const actions = {
  fetchReviewsByGroupName,
  clearReviews,
  fetchInquiriesByGroupName,
  clearInquiries,
  fetchRelatedItems
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_REVIEWS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_INQUIRIES] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_REVIEWS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_INQUIRIES] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_REVIEW] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_REVIEW] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [APPEND_REVIEWS] : (state, action) => {
    action.payload.reviews.content.forEach(element => {
      state.reviews.content.push(element)
    })
    action.payload.reviews.content = state.reviews.content
    return Object.assign({}, state, action.payload)
  },
  [APPEND_INQUIRIES] : (state, action) => {
    action.payload.inquiries.content.forEach(element => {
      state.inquiries.content.push(element)
    })
    action.payload.inquiries.content = state.inquiries.content
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_RELATED_ITEMS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { reviews: null, inquiries: null, relatedItems: null }
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
