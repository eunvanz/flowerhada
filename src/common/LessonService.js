import { API_BASE_URL, IMG_BASE_URL } from './serverConfig'
import { IMGUR_CLIENT_ID } from 'common/constants'
import axios from 'axios'

export const postLesson = lesson => {
  return axios.post(`${API_BASE_URL}/lessons`, lesson)
}

export const postLessonImage = file => {
  const data = new FormData()
  data.append('image', file)
  return axios.create({ headers: { 'Authorization': IMGUR_CLIENT_ID } }).post(`${IMG_BASE_URL}`, data)
}

export const putLesson = (lesson, id) => {
  return axios.put(`${API_BASE_URL}/lessons/${id}`, lesson)
}

export const deleteLesson = id => {
  return axios.delete(`${API_BASE_URL}/lessons/${id}`)
}

export const getAllLessons = () => {
  return axios.get(`${API_BASE_URL}/lessons`)
}

export const getLesson = id => {
  return axios.get(`${API_BASE_URL}/lessons/${id}`)
}

export const getLessonByMainCategory = mainCategory => {
  return axios.get(`${API_BASE_URL}/lessons/main-category/${mainCategory}`)
}

export const getLessonByGroupName = groupName => {
  return axios.get(`${API_BASE_URL}/lessons/group-name/${groupName}`)
}
