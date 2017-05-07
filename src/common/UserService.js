import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const signUp = (userInfo) => {
  return axios.post(`${API_BASE_URL}/users`, userInfo)
}

export const checkDupEmail = (email) => {
  return axios.get(`${API_BASE_URL}/users/dup-check?email=${email}`)
}

export const login = (userInfo) => {
  return axios.post(`${API_BASE_URL}/users/login`, userInfo)
}

export const socialLogin = (userInfo, socialType) => {
  return axios.post(`${API_BASE_URL}/users/social-login?socialType=${socialType}`, userInfo)
}

// export const getUserByEmail = email => {
//   return axios.get(`${API_BASE_URL}/users?email=${email}`)
// }

export const getUserByEmailAndPassword = (userInfo) => {
  return axios.post(`${API_BASE_URL}/users/email-and-password`, userInfo)
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

export const getUserByPhone = phone => {
  return axios.get(`${API_BASE_URL}/users/phone/${phone}`)
}

export const resetUserPassword = (email) => {
  return axios.put(`${API_BASE_URL}/users/reset-password?email=${email}`)
}

export const getUserByEmailAndSocialType = (email, socialType) => {
  return axios.get(`${API_BASE_URL}/users/social?email=${email}&socialType=${socialType}`)
}
