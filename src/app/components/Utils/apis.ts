export const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://api.familytreee.zerosoft.in";
import axios from 'axios';

export const getBaseURL = () => {
    console.log(window.location.hostname);
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    } else if (window.location.hostname === 'admin.familytreee.zerosoft.in') {
        return 'https://api.familytreee.zerosoft.in';
    }
    return 'http://localhost:8000';
};

const API = axios.create({
    baseURL: getBaseURL(),
    timeout: 20000,
});

API.defaults.headers.common['Content-Type'] = 'application/json';

API.interceptors.request.use(
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

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;

export const API_ENDPOINTS = {
  

  GET_FAMILY_TREE: '/admin/get-family-tree/',

};
