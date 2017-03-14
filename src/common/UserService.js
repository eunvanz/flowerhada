import { API_BASE_URL } from './serverConfig'
import axios from 'axios'
import superagent from 'superagent'
import superagentPromise from 'superagent-promise'

const agent = superagentPromise(superagent, Promise)

export const signUp = (userInfo) => {
  return agent.post(`${API_BASE_URL}/users`).send(userInfo).end()
}

export const checkDupEmail = (email) => {
  return axios.get(`${API_BASE_URL}/users?email=${email}`)
}

export const login = (userInfo) => {
  return agent.post(`${API_BASE_URL}/users/login`).send(userInfo).end()
}

export const getUserByEmail = email => {
  return axios.get(`${API_BASE_URL}/users?email=${email}`)
}

export const updateUserPoint = (id, point) => {
  return axios.put(`${API_BASE_URL}/users/${id}/point/${point}`)
}
