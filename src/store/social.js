// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_SOCIAL_TYPE = 'RECEIVE_SOCIAL_TYPE'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveSocialType (type = null) {
  return {
    type    : RECEIVE_SOCIAL_TYPE,
    payload : { type }
  }
}

export function setSocialType (type) {
  return dispatch => {
    return dispatch(receiveSocialType(type))
  }
}

export const actions = {
  receiveSocialType,
  setSocialType
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_SOCIAL_TYPE] : (state, action) => {
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { type: null }
export default function naverReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
