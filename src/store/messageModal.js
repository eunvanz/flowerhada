// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_SHOW = 'RECEIVE_SHOW'
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
export const RECEIVE_CANCEL_BTN_TXT = 'RECEIVE_CANCEL_BTN_TXT'
export const RECEIVE_CONFIRM_BTN_TXT = 'RECEIVE_CONFIRM_BTN_TXT'
export const RECEIVE_ON_CONFIRM_CLICK = 'RECEIVE_ON_CONFIRM_CLICK'
export const RECEIVE_PROCESS = 'RECEIVE_PROCESS'
export const RECEIVE_MESSAGE_MODAL = 'RECEIVE_MESSAGE_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
function receiveMessage (message = null) {
  return {
    type    : RECEIVE_MESSAGE,
    payload : { message }
  }
}

function receiveShow (show = false) {
  return {
    type    : RECEIVE_SHOW,
    payload : { show }
  }
}

function receiveCancelBtnTxt (cancelBtnTxt = null) {
  return {
    type    : RECEIVE_CANCEL_BTN_TXT,
    payload : { cancelBtnTxt }
  }
}

function receiveConfirmBtnTxt (confirmBtnTxt = '확인') {
  return {
    type    : RECEIVE_CONFIRM_BTN_TXT,
    payload : { confirmBtnTxt }
  }
}

function receiveOnConfimClick (onConfirmClick = () => {}) {
  return {
    type    : RECEIVE_CONFIRM_BTN_TXT,
    payload : { onConfirmClick }
  }
}

function receiveProcess (process = false) {
  return {
    type    : RECEIVE_PROCESS,
    payload : { process }
  }
}

const defaultMessageModal = {
  show: false,
  message: '',
  cancelBtnTxt: null,
  confirmBtnTxt: '확인',
  onConfirmClick: () => {},
  process: false
}

function receiveMessageModal (messageModal = defaultMessageModal) {
  return {
    type: RECEIVE_MESSAGE_MODAL,
    payload: messageModal
  }
}

export const setMessageModalMessage = message => {
  return dispatch => {
    return dispatch(receiveMessage(message))
  }
}

export const setMessageModalShow = show => {
  return dispatch => {
    return dispatch(receiveShow(show))
  }
}

export const setMessageModalCancelBtnTxt = cancelBtnTxt => {
  return dispatch => {
    return dispatch(receiveCancelBtnTxt(cancelBtnTxt))
  }
}

export const setMessageModalConfirmBtnTxt = confirmBtnTxt => {
  return dispatch => {
    return dispatch(receiveConfirmBtnTxt(confirmBtnTxt))
  }
}

export const setMessageModalOnConfirmClick = onConfirmClick => {
  return dispatch => {
    return dispatch(receiveOnConfimClick(onConfirmClick))
  }
}

export const setMessageModalProcess = process => {
  return dispatch => {
    return dispatch(receiveProcess(process))
  }
}

export const setMessageModal = messageModal => {
  return dispatch => {
    return dispatch(receiveMessageModal(messageModal))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_MESSAGE] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_SHOW] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_CANCEL_BTN_TXT] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_CONFIRM_BTN_TXT] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_ON_CONFIRM_CLICK] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_PROCESS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_MESSAGE_MODAL] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  show: false,
  message: '',
  cancelBtnTxt: null,
  confirmBtnTxt: '확인',
  onConfirmClick: () => {},
  process: false
}
export default function inquiryReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
