import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3001/api' })

export const getListings = (params) => API.get('/listings', { params })
export const getListingById = (id) => API.get(`/listings/${id}`)
export const createListing = (formData) =>
  API.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteListing = (id) => API.delete(`/listings/${id}`)
