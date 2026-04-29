import { API_URL } from '../config';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
