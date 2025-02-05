// axiosInstance.js

import axios from "axios";

const BASE_URL = "/auth"; // Replace with your backend URL if different
const AxiosInstance = axios.create();

// Setting base URL and enabling credentials
AxiosInstance.defaults.baseURL = BASE_URL;
AxiosInstance.defaults.withCredentials = true;

// Add a request interceptor to include token in headers
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  console.log("token", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
  }
  return config;
});

export default AxiosInstance;
