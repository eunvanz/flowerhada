import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const getTutorById = tutorId => {
  return axios.get(`${API_BASE_URL}/tutors/${tutorId}`)
}

export const getAllTutors = () => {
  return axios.get(`${API_BASE_URL}/tutors`)
}

export const putTutor = tutor => {
  return axios.put(`${API_BASE_URL}/tutors`, tutor)
}

export const postTutor = tutor => {
  return axios.post(`${API_BASE_URL}/tutors`, tutor)
}

export const deleteTutor = id => {
  return axios.delete(`${API_BASE_URL}/tutors/${id}`)
}
