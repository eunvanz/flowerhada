import { getBoardsByCategory, getBoardById } from 'common/BoardService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_BOARDS = 'RECEIVE_BOARDS'
export const APPEND_BOARDS = 'APPEND_BOARDS'
export const SELECT_BOARD = 'SELECT_BOARD'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveBoards (boards = null) {
  return {
    type    : RECEIVE_BOARDS,
    payload : { boardList: boards }
  }
}

export function appendBoards (boards = null) {
  return {
    type: APPEND_BOARDS,
    payload: { boardList: boards }
  }
}

export function selectBoard (board = null) {
  return {
    type: SELECT_BOARD,
    payload: { selected: board }
  }
}

export const fetchBoardsByCategory = (category, curPage, perPage) => {
  return dispatch => {
    return getBoardsByCategory(category, curPage, perPage)
    .then(res => {
      return dispatch(receiveBoards(res.data))
    })
  }
}

export const fetchBoard = (id) => {
  return dispatch => {
    return getBoardById(id)
    .then(res => {
      return dispatch(selectBoard(res.data))
    })
  }
}

export const fetchAndAppendBoards = (category, curPage, perPage) => {
  return (dispatch) => {
    return getBoardsByCategory(category, curPage, perPage)
    .then(res => {
      return dispatch(appendBoards(res.data))
    })
  }
}

export const clearBoards = () => {
  return dispatch => {
    return dispatch(receiveBoards(null))
  }
}

export const unselectBoard = () => {
  return dispatch => {
    return dispatch(selectBoard(null))
  }
}

export const actions = {
  fetchBoardsByCategory,
  clearBoards
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_BOARDS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [APPEND_BOARDS] : (state, action) => {
    action.payload.content.forEach(element => {
      state.content.push(element)
    })
    action.payload.content = state.content
    return action.payload
  },
  [SELECT_BOARD] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { boardList: null, selected: null }
export default function boardReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
