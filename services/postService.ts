import { api } from './api';
import { useAuthStore } from '../store/authStore';
import { ConsultationStatus } from '~/types/consultation';

// 타입 정의
export type PostType = 'SENTENCE' | 'GENERAL' | 'COLUMN' | 'QUESTION' | 'CONSULTATION';

export interface CreateMediaDto {
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface CreatePostDto {
  categoryId?: number;
  title?: string;
  content?: string;
  points?: number;
  basePrice?: number;
  isPrivate?: boolean;
  type: PostType;
  media?: CreateMediaDto[];
  tags?: string[];
}

export interface PostParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'popular';
  type?: PostType;
  admin_pick?: boolean;
}

// export interface MediaDto {
//   media_id?: number;
//   mediaUrl: string; // snake_case -> camelCase
//   mediaType: 'IMAGE' | 'VIDEO'; // snake_case -> camelCase
// }
// GET API

interface GetPostsParams {
  page: number;
  limit: number;
  sort: 'latest' | 'oldest' | 'popular';
  type?: string;
  admin_pick?: boolean;
  topic_id?: number;
  category_id?: number;
}

export const getPostApi = async ({
  page,
  limit,
  sort,
  type,
  admin_pick,
  topic_id,
  category_id,
}: GetPostsParams) => {
  try {
    const token = useAuthStore.getState().userToken;

    const params = {
      page,
      limit,
      sort,
      type,
      admin_pick,
      topic_id,
      category_id,
    };

    // undefined 값 제거
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    const response = await api.get('/posts', {
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
    }
    console.log('add postpayload', createPostDto);

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
  topic_id: number;
  title: ReactNode;
  category: any;
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

export interface MediaDto {
  media_id?: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  type?: string;
  points?: number;
  categoryId?: number;
  media?: MediaDto[];
  tags?: string[];
}

export class PostService {
  private handleError(error: any) {
    console.error('API Error:', error);
    if (error.response) {
      // 서버 응답의 자세한 에러 메시지 출력
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
      throw new Error(error.response.data.message || 'API request failed');
    }
    throw error;
  }

  async updatePost(postId: number, updateData: UpdatePostDto) {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }

      // media 배열이 있는 경우 필드 순서 정렬
      const transformedData = {
        ...updateData,
        media: updateData.media?.map((item) => ({
          mediaType: item.mediaType, // 순서 변경
          mediaUrl: item.mediaUrl, // 순서 변경
          mediaId: item.media_id, // 순서 변경
        })),
      };

      // undefined 필드 제거 및 정렬된 객체 생성
      const payload = Object.keys(transformedData)
        .sort()
        .reduce((obj, key) => {
          if (transformedData[key] !== undefined) {
            obj[key] = transformedData[key];
          }
          return obj;
        }, {});

      console.log('Final Payload:', JSON.stringify(payload, null, 2));

      const response = await api.patch(`/posts/${postId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePost(postId: number) {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const postService = new PostService();

export const getConsultationsApi = async ({
  page,
  limit,
  status,
  sort = 'latest',
  teacher_id,
  category_id,
  topic_id,
}: {
  page: number;
  limit: number;
  status?: ConsultationStatus;
  sort?: 'latest' | 'oldest';
  teacher_id?: number;
  category_id?: number;
  topic_id?: number;
}) => {
  try {
    const token = useAuthStore.getState().userToken;
    const params = { page, limit, status, sort, teacher_id, category_id, topic_id };

    // undefined 값 제거
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    console.log('params', params);

    const response = await api.get('/posts/consultations', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Get consultations failed', error);
    throw error;
  }
};

export const getConsultationByIdApi = async (id: number) => {
  try {
    const token = useAuthStore.getState().userToken;
    const response = await api.get(`/posts/consultations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Get consultation failed', error);
    throw error;
  }
};
