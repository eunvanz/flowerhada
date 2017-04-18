import { getCommentByGroupName } from 'common/CommentService'
import { getLessonByGroupName } from 'common/LessonService'
import { getProductByRelationName } from 'common/ProductService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_REVIEWS = 'RECEIVE_REVIEWS'
export const RECEIVE_REVIEW = 'RECEIVE_REVIEW'
export const CLEAR_REVIEWS = 'CLEAR_REVIEWS'
export const CLEAR_REVIEW = 'CLEAR_REVIEW'
export const APPEND_REVIEWS = 'APPEND_REVIEWS'
export const RECEIVE_ITEM_INQUIRIES = 'RECEIVE_ITEM_INQUIRIES'
export const CLEAR_ITEM_INQUIRIES = 'CLEAR_ITEM_INQUIRIES'
export const APPEND_ITEM_INQUIRIES = 'APPEND_ITEM_INQUIRIES'
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

export function receiveItemInquiries (inquiries = null) {
  return {
    type: RECEIVE_ITEM_INQUIRIES,
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

export function clearItemInquiries () {
  return {
    type: CLEAR_ITEM_INQUIRIES,
    payload: { inquiries: null }
  }
}

export function appendReviews (reviews = null) {
  return {
    type: APPEND_REVIEWS,
    payload: { reviews }
  }
}

export function appendItemInquiries (inquiries = null) {
  return {
    type: APPEND_ITEM_INQUIRIES,
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

export const fetchItemInquiriesByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'inquiry', curPage, perPage)
    .then(res => {
      return dispatch(receiveItemInquiries(res.data))
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

export const appendItemInquiriesByGroupName = (groupName, curPage, perPage) => {
  return (dispatch) => {
    return getCommentByGroupName(groupName, 'inquiry', curPage, perPage)
    .then(res => {
      return dispatch(appendItemInquiries(res.data))
    })
  }
}

export const fetchRelatedItems = (item, type) => {
  let service = null
  if (type === 'lesson') service = getLessonByGroupName
  else if (type === 'product') service = getProductByRelationName
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
  fetchItemInquiriesByGroupName,
  clearItemInquiries,
  fetchRelatedItems
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_REVIEWS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_ITEM_INQUIRIES] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_REVIEWS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_ITEM_INQUIRIES] : (state, action) => {
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
  [APPEND_ITEM_INQUIRIES] : (state, action) => {
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
export default function itemReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
