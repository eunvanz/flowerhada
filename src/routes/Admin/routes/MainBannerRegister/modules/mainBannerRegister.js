import axios from 'axios'
import { API_BASE_URL } from '../../../../../common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_MAIN_BANNER = 'RECEIVE_MAIN_BANNER'
export const CLEAR_MAIN_BANNER = 'CLEAR_MAIN_BANNER'

// ------------------------------------
// Actions
// ------------------------------------

export function receiveMainBanner (banner = null) {
  return {
    type: RECEIVE_MAIN_BANNER,
    payload: banner
  }
}

export const fetchMainBanner = (id) => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/main-banners/${id}`)
    .then(res => {
      return dispatch(receiveMainBanner(res.data))
    })
  }
}

export function clearMainBanner () {
  return {
    type: CLEAR_MAIN_BANNER,
    payload: null
  }
}

export const actions = {
  fetchMainBanner,
  clearMainBanner
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_MAIN_BANNER] : (state, action) => {
    return action.payload
  },
  [CLEAR_MAIN_BANNER] : (state, action) => {
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
