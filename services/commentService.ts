import { api } from './api';
import { useAuthStore } from '../store/authStore';

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentCommentId?: number;
  media?: {
    media_url: string;
    media_type: string;
  }[];
}

export const commentService = {
  // 댓글 생성
  createComment: async (data: CreateCommentRequest) => {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Request data:', data);
      const response = await api.post(
        '/comments',
        {
          postId: data.postId,
          content: data.content,
          parentCommentId: data.parentCommentId,
          media: data.media,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create comment failed:', error);
      throw error;
    }
  },

  // 댓글 목록 조회
  getComments: async (postId: number, page = 1, limit = 10) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/comments', {
      params: {
        postId,
        page,
        limit,
        sort: 'latest',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 댓글 수정
  updateComment: async (commentId: number, content: string) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.patch(
      `/comments/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
