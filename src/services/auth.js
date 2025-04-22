import api, { BASE_URL } from './api';

export const registerUser = async (userData) => {
  const { data } = await api.post(`${BASE_URL}/api/auth/register/`, userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await api.post(`${BASE_URL}/api/auth/login/`, userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
};
