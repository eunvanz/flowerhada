import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postLesson = lesson => {
  return axios.post(`${API_BASE_URL}/lessons`, lesson)
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
