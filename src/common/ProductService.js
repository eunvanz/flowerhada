import { API_BASE_URL } from './serverConfig'
import axios from 'axios'

export const postProduct = product => {
  return axios.post(`${API_BASE_URL}/products`, product)
}

export const putProduct = (product, id) => {
  return axios.put(`${API_BASE_URL}/products/${id}`, product)
}

export const deleteProduct = id => {
  return axios.delete(`${API_BASE_URL}/products/${id}`)
}

export const getAllProducts = () => {
  return axios.get(`${API_BASE_URL}/products`)
}

export const getProduct = id => {
  return axios.get(`${API_BASE_URL}/products/${id}`)
}

export const getProductByMainCategory = mainCategory => {
  const encodedMainCategory = encodeURIComponent(mainCategory)
  return axios.get(`${API_BASE_URL}/products/main-category/${encodedMainCategory}`)
}

export const getProductBySubCategory = subCategory => {
  const encodedSubCategory = encodeURIComponent(subCategory)
  return axios.get(`${API_BASE_URL}/products/sub-category/${encodedSubCategory}`)
}

export const getProductByRelationName = relationName => {
  const encodedRelationName = encodeURIComponent(relationName)
  return axios.get(`${API_BASE_URL}/products/relation-name/${encodedRelationName}`)
}
