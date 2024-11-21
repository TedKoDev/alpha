import { api } from './api';
import { useAuthStore } from '../store/authStore';

// 타입 정의
export type PostType = 'SENTENCE' | 'GENERAL' | 'COLUMN' | 'QUESTION';

export interface CreateMediaDto {
  // 미디어 관련 필드 정의
  url: string;
  type: string;
  // 기타 필요한 미디어 필드
}

export interface CreatePostDto {
  categoryId?: number;
  title?: string;
  content?: string;
  points?: number;
  type: PostType;
  media?: CreateMediaDto[];
  tags?: string[];
}

export interface PostParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'popular';
  type?: PostType;
}

// GET API
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
    console.error('Get posts failed', error);
    throw error;
  }
};

// POST API
export const addPostApi = async (createPostDto: CreatePostDto) => {
  try {
    const token = useAuthStore.getState().userToken;

    if (!token) {
      throw new Error('No token found');
    }
    //console.log('createPostDto', createPostDto);

    const response = await api.post('/posts/', createPostDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Add post failed', error);
    throw error;
  }
};

// GET API for single post
export const getPostByIdApi = async (id: number) => {
  try {
    const token = useAuthStore.getState().userToken;

    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get post by id failed', error);
    throw error;
  }
};

// 새로운 타입 정의
export interface Topic {
  id: number;
  name: string;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  topicId: number;
}

// 새로운 API 함수들
export const getTopicsApi = async () => {
  try {
    const token = useAuthStore.getState().userToken;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/posts/topics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    throw error;
  }
};

export const getCategoriesByTopicApi = async (topicId: number) => {
  try {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get(`/posts/categories/${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get categories failed', error);
    throw error;
  }
};
