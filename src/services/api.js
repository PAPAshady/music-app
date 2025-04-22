import axios from 'axios';
import { getAccessToken } from '../utils/storageUtils';

export const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/v1/api`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

export default api;
