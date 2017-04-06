import { getAllInquiriesByUserId, getAllInquiries } from 'common/InquiryService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_INQUIRIES = 'RECEIVE_INQUIRIES'
export const RECEIVE_INQUIRY = 'RECEIVE_INQUIRY'
export const RECEIVE_INQUIRY_MODAL = 'RECEIVE_INQUIRY_MODAL'
export const RECEIVE_INQUIRY_MODAL_DETAIL = 'RECEIVE_INQUIRY_MODAL_DETAIL'
export const APPEND_INQUIRIES = 'APPEND_INQUIRIES'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveInquiries (inquiries = null) {
  return {
    type    : RECEIVE_INQUIRIES,
    payload : { inquiryList: inquiries }
  }
}

export function appendInquiries (inquiries = null) {
  return {
    type    : APPEND_INQUIRIES,
    payload : { inquiryList: inquiries }
  }
}

export function receiveInquiry (inquiry = null) {
  return {
    type    : RECEIVE_INQUIRY,
    payload : { selected: inquiry }
  }
}

export function receiveInquiryModal (inquiryModal) {
  return {
    type    : RECEIVE_INQUIRY_MODAL,
    payload : { inquiryModal }
  }
}

export function receiveInquiryModalDetail (object) {
  return {
    type    : RECEIVE_INQUIRY_MODAL_DETAIL,
    payload : object
  }
}

export const fetchInquiriesByUserId = (userId, curPage, perPage) => {
  return dispatch => {
    return getAllInquiriesByUserId(userId, curPage, perPage)
    .then(res => {
      return dispatch(receiveInquiries(res.data))
    })
  }
}

export const fetchAllInquiries = (curPage, perPage) => {
  return dispatch => {
    return getAllInquiries(curPage, perPage)
    .then(res => {
      return dispatch(receiveInquiries(res.data))
    })
  }
}

export const appendInquiriesByUserId = (userId, curPage, perPage) => {
  return dispatch => {
    return getAllInquiriesByUserId(userId, curPage, perPage)
    .then(res => {
      return dispatch(appendInquiries(res.data))
    })
  }
}

export const selectInquiry = inquiry => {
  return dispatch => {
    return dispatch(receiveInquiry(inquiry))
  }
}

export const clearInquiries = () => {
  return dispatch => {
    return dispatch(receiveInquiries(null))
  }
}

export const setInquiryModal = inquiryModal => {
  return dispatch => {
    return dispatch(receiveInquiryModal(inquiryModal))
  }
}

export const setInquiryModalShow = bool => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ show: bool }))
  }
}

export const setInquiryModalProcess = bool => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ process: bool }))
  }
}

export const setInquiryModalInquiry = inquiry => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ inquiry }))
  }
}

export const setInquiryModalDefaultCategory = defaultCategory => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ defaultCategory }))
  }
}

export const setInquiryModalAfterSubmit = afterSubmit => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ afterSubmit }))
  }
}

export const setInquiryModalMode = mode => {
  return dispatch => {
    return dispatch(receiveInquiryModalDetail({ mode }))
  }
}

export const actions = {
  fetchInquiriesByUserId,
  clearInquiries
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_INQUIRIES] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_INQUIRY] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_INQUIRY_MODAL] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_INQUIRY_MODAL_DETAIL] : (state, action) => {
    const newInquiryModal = Object.assign({}, state.inquiryModal, action.payload)
    return Object.assign({}, state, { inquiryModal: newInquiryModal })
  },
  [APPEND_INQUIRIES] : (state, action) => {
    action.payload.inquiryList.content.forEach(element => {
      state.inquiryList.content.push(element)
    })
    action.payload.inquiryList.content = state.inquiryList.content
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  inquiryList: null,
  selected: null,
  inquiryModal:
  {
    inquiry: {},
    show: false,
    process: false,
    defaultCategory: '분류선택',
    afterSubmit: () => {},
    mode: 'post'
  }
}
export default function inquiryReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
