import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postLessonDay = lessonDay => {
  return axios.post(`${API_BASE_URL}/lesson-days`, lessonDay)
}

export const putLessonDay = (lessonDay, id) => {
  return axios.put(`${API_BASE_URL}/lesson-days/${id}`, lessonDay)
}

export const deleteLessonDay = id => {
  return axios.delete(`${API_BASE_URL}/lesson-days/${id}`)
}

export const deleteLessonDayByLessonId = lessonId => {
  return axios.delete(`${API_BASE_URL}/lesson-days/lesson-id/${lessonId}`)
}
