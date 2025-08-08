import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // change if backend URL changes
});

// Add token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
