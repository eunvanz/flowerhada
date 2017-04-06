import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postInquiry = inquiry => {
  return axios.post(`${API_BASE_URL}/inquiries`, inquiry)
}

export const putInquiry = (inquiry, id) => {
  return axios.put(`${API_BASE_URL}/inquiries/${id}`, inquiry)
}

export const deleteInquiry = id => {
  return axios.delete(`${API_BASE_URL}/inquiries/${id}`)
}

export const getAllInquiries = (curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/inquiries?curPage=${curPage}&perPage=${perPage}`)
}

export const getAllInquiriesByUserId = (userId, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/inquiries/user/${userId}?curPage=${curPage}&perPage=${perPage}`)
}
