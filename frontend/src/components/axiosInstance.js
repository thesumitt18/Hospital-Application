// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const http = axios.create({
  baseURL: 'http://localhost:8989/api', // Replace with your API base URL
  timeout: 10000, // Optional timeout
}); 

// Request Interceptor
http.interceptors.request.use(
  (config) => {
    // Modify the request config before sending the request
    // For example, you can add an Authorization header
    const token = localStorage.getItem('token'); // Or however you manage tokens
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the request error
    return Promise.reject(error);
  }
);

// Response Interceptor
http.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response.data; // Return the data directly
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with a status code outside of the range of 2xx
      console.error('Error Response:', error.response);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response.data);
  }
);

export default http;
