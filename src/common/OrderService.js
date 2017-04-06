import { API_BASE_URL, IAMPORT_URL } from './serverConfig'
import axios from 'axios'
import qs from 'qs'

export const getOrdersByUserId = (userId, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/orders/user/${userId}?curPage=${curPage}&perPage=${perPage}`)
}

export const getOrders = (curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/orders?curPage=${curPage}&perPage=${perPage}`)
}

export const getOrderById = id => {
  return axios.get(`${API_BASE_URL}/orders/${id}`)
}

export const postOrder = order => {
  return axios.post(`${API_BASE_URL}/orders`, order)
}

export const postOrderTransaction = order => {
  return axios.post(`${API_BASE_URL}/orders/transaction`, order, { validateStatus: status => status === 200 })
}

export const updateOrder = (order, id) => {
  order.updateDate = null
  order.carts = null
  order.user = null
  return axios.put(`${API_BASE_URL}/orders/${id}`, order)
}

export const cancelPayment = order => {
  order.updateDate = null
  order.carts = null
  order.user = null
  return axios.post(`${API_BASE_URL}/orders/cancel`, order)
}
