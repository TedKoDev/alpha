import { api } from './api';
import { useAuthStore } from '../store/authStore';

export const likeService = {
  // 게시글 좋아요 토글
  togglePostLike: async (postId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post(
      `/likes/post/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // 댓글 좋아요 토글
  toggleCommentLike: async (commentId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }
    console.log('toggleCommentLike111', commentId);

    const response = await api.post(
      `/likes/comment/${commentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('response', response.data);
    return response.data;
  },
};
