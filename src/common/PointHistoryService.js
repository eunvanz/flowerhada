import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const getPointHistoryByUserId = (userId, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/point-histories/user/${userId}?curPage=${curPage}&perPage=${perPage}`)
}

export const deletePointHistory = id => {
  return axios.delete(`${API_BASE_URL}/point-histories/${id}`)
}

export const postPointHistory = pointHistory => {
  return axios.post(`${API_BASE_URL}/point-histories`, pointHistory)
}
