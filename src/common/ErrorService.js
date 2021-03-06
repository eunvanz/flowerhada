import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postError = error => {
  return axios.post(`${API_BASE_URL}/errors`, error)
}

export const putError = (error, id) => {
  error.date = null
  error.user.regDate = null
  return axios.put(`${API_BASE_URL}/errors/${id}`, error)
}

export const deleteError = id => {
  return axios.delete(`${API_BASE_URL}/errors/${id}`)
}

export const getAllError = (curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/errors?curPage=${curPage}&perPage=${perPage}`)
}
