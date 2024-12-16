
import axios from 'axios';

// Create an Axios instance
const http = axios.create({
  baseURL: 'http://localhost:8989/api', 
  timeout: 10000, 
}); 

// Request Interceptor
http.interceptors.request.use(
  (config) => {  
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
http.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    if (error.response) {
      console.error('Error Response:', error.response);
    } else if (error.request) {
      
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response.data);
  }
);

export default http;
