import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3001/api' })

// Attach token to every request if present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('lf_token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

// Listings
export const getListings = (params) => API.get('/listings', { params })
export const getListingById = (id) => API.get(`/listings/${id}`)
export const createListing = (formData) =>
  API.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteListing = (id) => API.delete(`/listings/${id}`)

// Auth
export const loginUser = (data) => API.post('/auth/login', data)
export const registerUser = (data) => API.post('/auth/register', data)
