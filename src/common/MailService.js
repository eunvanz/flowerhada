import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postEmail = email => {
  return axios.post(`${API_BASE_URL}/email`, email)
}
