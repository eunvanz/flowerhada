import { API_BASE_URL } from './serverConfig'
import axios from 'axios'
// import superagent from 'superagent'
// import superagentPromise from 'superagent-promise'

// const agent = superagentPromise(superagent, Promise)

export const getAllMainBanners = () => {
  return axios.get(`${API_BASE_URL}/main-banners`)
}

export const getMainBannerById = id => {
  return axios.get(`${API_BASE_URL}/main-banners/${id}`)
}

export const postMainBanner = data => {
  return axios.post(`${API_BASE_URL}/main-banners`, data)
}

export const putMainBanner = (data, id) => {
  return axios.put(`${API_BASE_URL}/main-banners/${id}`, data)
}

export const deleteMainBanner = id => {
  return axios.delete(`${API_BASE_URL}/main-banners/${id}`)
}
