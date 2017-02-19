import axios from 'axios'
import { API_BASE_URL } from 'common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT'
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT'

// ------------------------------------
// Actions
// ------------------------------------

export function receiveProduct (product = null) {
  return {
    type: RECEIVE_PRODUCT,
    payload: product
  }
}

export const fetchProduct = (id) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/products/${id}`)
    .then(res => {
      return dispatch(receiveProduct(res.data))
    })
  }
}

export function clearProduct () {
  return {
    type: CLEAR_PRODUCT,
    payload: null
  }
}

export const actions = {
  fetchProduct,
  clearProduct
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_PRODUCT] : (state, action) => {
    return action.payload
  },
  [CLEAR_PRODUCT] : (state, action) => {
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
