import { getOrdersByUserId, getOrderById, getOrders } from 'common/OrderService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS'
export const SELECT_ORDER = 'SELECT_ORDER'
export const RECEIVE_ORDER_ITEM = 'RECEIVE_ORDER_ITEM'
export const RECEIVE_ORDER_TRANSACTION = 'RECEIVE_ORDER_TRANSACTION'
export const CLEAR_ORDER_TRANSACTION = 'CLEAR_ORDER_TRANSACTION'
export const APPEND_ORDERS = 'APPEND_ORDERS'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveOrders (orders = null) {
  return {
    type    : RECEIVE_ORDERS,
    payload : { orderList: orders }
  }
}

export function appendOrders (orders = null) {
  return {
    type    : APPEND_ORDERS,
    payload : { orderList: orders }
  }
}

export function selectOrder (order = null) {
  return {
    type: SELECT_ORDER,
    payload: { selected: order }
  }
}

export function receiveOrderItem (orderItem = null) {
  return {
    type    : RECEIVE_ORDER_ITEM,
    payload : { orderItem }
  }
}

export function receiveOrderTransaction (orderTransaction = null) {
  return {
    type    : RECEIVE_ORDER_TRANSACTION,
    payload : { orderTransaction }
  }
}

export function clearOrderTransaction () {
  return {
    type    : CLEAR_ORDER_TRANSACTION,
    payload : { orderTransaction: null }
  }
}

export function unselectOrder () {
  return dispatch => {
    return dispatch(selectOrder(null))
  }
}

export function clearOrderItem () {
  return dispatch => {
    return dispatch(receiveOrderItem(null))
  }
}

export const fetchOrdersByUserId = (userId, curPage, perPage) => {
  return dispatch => {
    return getOrdersByUserId(userId, curPage, perPage)
    .then(res => {
      return dispatch(receiveOrders(res.data))
    })
  }
}

export const appendOrdersByUserId = (userId, curPage, perPage) => {
  return dispatch => {
    return getOrdersByUserId(userId, curPage, perPage)
    .then(res => {
      return dispatch(appendOrders(res.data))
    })
  }
}

export const fetchOrders = (curPage, perPage) => {
  return dispatch => {
    return getOrders(curPage, perPage)
    .then(res => {
      return dispatch(receiveOrders(res.data))
    })
  }
}

export const fetchAndAppendMoreOrders = (curPage, perPage) => {
  return dispatch => {
    return getOrders(curPage, perPage)
    .then(res => {
      return dispatch(appendOrders(res.data))
    })
  }
}

export const fetchOrderById = id => {
  return dispatch => {
    return getOrderById(id)
    .then(res => {
      return dispatch(selectOrder(res.data))
    })
  }
}

export const clearOrders = () => {
  return dispatch => {
    return dispatch(receiveOrders(null))
  }
}

export const actions = {
  fetchOrdersByUserId,
  fetchOrderById,
  unselectOrder,
  clearOrders,
  receiveOrderItem,
  clearOrderItem
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_ORDERS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [SELECT_ORDER] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_ORDER_ITEM] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [RECEIVE_ORDER_TRANSACTION] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [CLEAR_ORDER_TRANSACTION] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [APPEND_ORDERS] : (state, action) => {
    action.payload.orderList.content.forEach(element => {
      state.orderList.content.push(element)
    })
    action.payload.orderList.content = state.orderList.content
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { orderList: null, selected: null, orderItem: null, orderTransaction: null }
export default function orderReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
