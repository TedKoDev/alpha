import { api } from './api';
import { useAuthStore } from '../store/authStore';

export const getWordApi = async () => {
  try {
    const token = useAuthStore.getState().userToken;
    console.log('token', token);
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/word/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get word failed', error);
    throw error;
  }
};

export const getDayPostApi = async () => {
  try {
    const response = await api.get('/word/day');
    return response.data;
  } catch (error) {
    console.error('Get day post failed', error);
    throw error;
  }
};

export const authService = {
  getWordApi,
};
