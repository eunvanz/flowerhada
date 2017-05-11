import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postBoard = board => {
  return axios.post(`${API_BASE_URL}/boards`, board)
}

export const getBoardsByCategory = (category, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/boards/category/${category}?curPage=${curPage}&perPage=${perPage}`)
}

export const putBoard = board => {
  return axios.put(`${API_BASE_URL}/boards`, board)
}

export const getBoardById = id => {
  return axios.get(`${API_BASE_URL}/boards/${id}`)
}

export const deleteBoardById = id => {
  return axios.delete(`${API_BASE_URL}/boards/${id}`)
}

export const increaseBoardView = id => {
  return axios.put(`${API_BASE_URL}/boards/increase-view/${id}`)
}
