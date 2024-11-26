import { useAuthStore } from '~/store/authStore';
import { api } from './api';

interface YoutubeResponse {
  link: string;
  created_at: string;
}

export const youtubeService = {
  // 모든 유튜브 링크 가져오기
  getAllLinks: async () => {
    try {
      const token = useAuthStore.getState().userToken;
      const response = await api.get<YoutubeResponse[]>('/logs/youtube/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get youtube links failed', error);
      throw error;
    }
  },

  // 랜덤 유튜브 링크 가져오기
  getRandomLink: async () => {
    try {
      const token = useAuthStore.getState().userToken;
      const response = await api.get<YoutubeResponse>('/logs/youtube/random', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get random youtube link failed', error);
      throw error;
    }
  },
};
