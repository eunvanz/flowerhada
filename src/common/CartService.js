import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postCart = cart => {
  return axios.post(`${API_BASE_URL}/carts`, cart)
}

export const putCart = (cart, id) => {
  return axios.put(`${API_BASE_URL}/carts/${id}`, cart)
}

export const deleteCart = (userId, type, itemId) => {
  return axios.delete(`${API_BASE_URL}/carts/user/${userId}/${type}/${itemId}`)
}

export const getCartsByUserId = userId => {
  return axios.get(`${API_BASE_URL}/carts/user/${userId}`)
}

export const getCartsByUserIdAndType = (userId, type) => {
  return axios.get(`${API_BASE_URL}/carts/user/${userId}/${type}`)
}
