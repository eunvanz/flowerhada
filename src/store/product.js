import { getAllProducts, getProduct, getProductByMainCategory, getProductBySubCategory } from 'common/ProductService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'
export const SELECT_PRODUCT = 'SELECT_PRODUCT'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveProducts (products = null) {
  return {
    type    : RECEIVE_PRODUCTS,
    payload : { productList: products }
  }
}

export function selectProduct (product = null) {
  return {
    type: SELECT_PRODUCT,
    payload: { selected: product }
  }
}

export const unselectProduct = () => {
  return dispatch => {
    return dispatch(selectProduct(null))
  }
}

export const fetchProducts = () => {
  return dispatch => {
    return getAllProducts()
    .then(res => {
      return dispatch(receiveProducts(res.data))
    })
  }
}

export const fetchProduct = id => {
  return dispatch => {
    return getProduct(id)
    .then(res => {
      return dispatch(selectProduct(res.data))
    })
  }
}

export const fetchProductsByMainCategory = mainCategory => {
  return dispatch => {
    return getProductByMainCategory(mainCategory)
    .then(res => {
      return dispatch(receiveProducts(res.data))
    })
  }
}

export const fetchProductsBySubCategory = subCategory => {
  return dispatch => {
    return getProductBySubCategory(subCategory)
    .then(res => {
      return dispatch(receiveProducts(res.data))
    })
  }
}

export const clearProducts = () => {
  return dispatch => {
    return dispatch(receiveProducts(null))
  }
}

export const actions = {
  fetchProducts,
  fetchProduct,
  fetchProductsByMainCategory,
  unselectProduct,
  clearProducts
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_PRODUCTS] : (state, action) => {
    return Object.assign({}, state, action.payload)
  },
  [SELECT_PRODUCT] : (state, action) => {
    return Object.assign({}, state, action.payload)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { productList: null, selected: null }
export default function productReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
