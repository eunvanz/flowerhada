import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const getOptionsByProductId = productId => {
  return axios.get(`${API_BASE_URL}/options/product/${productId}`)
}

export const postOption = option => {
  return axios.post(`${API_BASE_URL}/options`, option)
}

export const deleteOption = id => {
  return axios.delete(`${API_BASE_URL}/options/${id}`)
}

export const putOption = option => {
  return axios.put(`${API_BASE_URL}/options/${option.id}`, option)
}
