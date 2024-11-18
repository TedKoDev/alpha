import { api } from './api';
import { useAuthStore } from '../store/authStore';

export interface logsParams {
  type?: 'TODAY_TASK_PARTICIPATION';
}

export const getlogsApi = async (params?: logsParams) => {
  try {
    const token = useAuthStore.getState().userToken;

    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/logs/count/', {
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
