import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const signUp = (userInfo) => {
  return axios.post(`${API_BASE_URL}/users`, userInfo)
}

export const checkDupEmail = (email) => {
  return axios.get(`${API_BASE_URL}/users?email=${email}`)
}

export const login = (userInfo) => {
  return axios.post(`${API_BASE_URL}/users/login`, userInfo)
}

export const getUserByEmail = email => {
  return axios.get(`${API_BASE_URL}/users?email=${email}`)
}

export const getUserById = id => {
  return axios.get(`${API_BASE_URL}/users/${id}`)
}

export const updateUserPoint = (id, point) => {
  return axios.put(`${API_BASE_URL}/users/${id}/point/${point}`)
}

export const updateUser = user => {
  return axios.put(`${API_BASE_URL}/users/${user.id}`, user)
}
