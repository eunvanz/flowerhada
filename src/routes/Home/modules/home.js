import axios from 'axios'
import { API_BASE_URL } from 'common/serverConfig'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_ACTIVE_MAIN_BANNERS = 'RECEIVE_ACTIVE_MAIN_BANNERS'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveMainBanners (bannerArray = []) {
  return {
    type    : RECEIVE_ACTIVE_MAIN_BANNERS,
    payload : { mainBanners: bannerArray.filter(banner => banner.activated) }
  }
}

export const fetchMainBanners = () => {
  return (dispatch) => {
    return axios.get(`${API_BASE_URL}/main-banners`)
    .then(res => {
      return dispatch(receiveMainBanners(res.data))
    })
  }
}

export const actions = {
  fetchMainBanners
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_ACTIVE_MAIN_BANNERS] : (state, action) => {
    return Object.assign({}, ...state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { mainBanners: [] }
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
