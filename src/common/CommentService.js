import { API_BASE_URL, IMG_BASE_URL } from './serverConfig'
import { IMGUR_CLIENT_ID } from 'common/constants'
import axios from 'axios'

export const postComment = comment => {
  return axios.post(`${API_BASE_URL}/comments`, comment)
}

export const putComment = (comment, id) => {
  return axios.put(`${API_BASE_URL}/comments/${id}`, comment)
}

export const deleteComment = id => {
  return axios.delete(`${API_BASE_URL}/comments/${id}`)
}

export const getCommentByGroupName = (groupName, type, curPage, perPage) => {
  return axios.get(`${API_BASE_URL}/comments/group-name/${groupName}/${type}?curPage=${curPage}&perPage=${perPage}`)
}

export const postCommentImage = file => {
  const data = new FormData()
  data.append('image', file)
  return axios.create({ headers: { 'Authorization': IMGUR_CLIENT_ID } }).post(`${IMG_BASE_URL}`, data)
}
