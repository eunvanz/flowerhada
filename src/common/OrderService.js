import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const getOrdersByUserId = userId => {
  return axios.get(`${API_BASE_URL}/orders/user/${userId}`)
}

export const getOrderById = id => {
  return axios.get(`${API_BASE_URL}/orders/${id}`)
}

export const postOrder = order => {
  return axios.post(`${API_BASE_URL}/orders`, order)
}

export const updateOrder = (order, id) => {
  return axios.post(`${API_BASE_URL}/orders/${id}`, order)
}
