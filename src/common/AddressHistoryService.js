import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const getAddressHistoryByUserId = userId => {
  return axios.get(`${API_BASE_URL}/address-histories/user/${userId}`)
}

export const refreshAddressHistory = (id) => {
  return axios.put(`${API_BASE_URL}/address-histories/refresh/${id}`)
}

export const deleteAddressHistory = id => {
  return axios.delete(`${API_BASE_URL}/address-histories/${id}`)
}

export const postAddressHistory = addressHistory => {
  return axios.post(`${API_BASE_URL}/address-histories`, addressHistory)
}
