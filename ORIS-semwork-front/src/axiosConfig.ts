import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'http://localhost:8080'
});

axiosConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default axiosConfig;