import axios from 'axios';

const instance = axios.create({
  baseURL: `http://${window.location.hostname}:8080`,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
