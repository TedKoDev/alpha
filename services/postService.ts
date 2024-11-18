import { api } from './api';
import { useAuthStore } from '../store/authStore';

export interface PostParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'popular';
  type?: 'SENTENCE' | 'GENERAL' | 'COLUMN' | 'QUESTION';
}

export const getPostApi = async (params?: PostParams) => {
  try {
    const token = useAuthStore.getState().userToken;

    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/posts/', {
      params,
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
