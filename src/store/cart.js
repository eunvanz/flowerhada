import { getCartsByUserId } from 'common/CartService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_CARTS = 'RECEIVE_CARTS'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveCarts (carts = null) {
  return {
    type    : RECEIVE_CARTS,
    payload : { cartList: carts }
  }
}

export const fetchCartsByUserId = userId => {
  return dispatch => {
    return getCartsByUserId(userId)
    .then(res => {
      return dispatch(receiveCarts(res.data))
    })
  }
}

export const clearCarts = () => {
  return dispatch => {
    return dispatch(receiveCarts(null))
  }
}

export const actions = {
  fetchCartsByUserId,
  clearCarts
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_CARTS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { cartList: null }
export default function cartReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
