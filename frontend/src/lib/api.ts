import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL de ton backend Laravel
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  }, 
});

export default api;
