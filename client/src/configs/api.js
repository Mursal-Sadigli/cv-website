import axios from 'axios'

// Production URL - Render backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://cv-website-api.onrender.com'

const api = axios.create({
    baseURL: BACKEND_URL
})

// Request interceptor - Token əlavə et
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;