import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { queryClient } from '~/queries/queryClient';
import { addPostApi, CreatePostDto, getPostApi, PostParams } from '~/services/postService';
import { useAuthStore } from '~/store/authStore';

// Post 응답 타입 정의
interface PostResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

interface Post {
  post_id: number;
  categoryId?: number;
  title?: string;
  content: string;
  points?: number;
  type: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  // 기타 필요한 필드
}

export function usePosts(params?: PostParams) {
  const token = useAuthStore((state) => state.userToken);

  return useQuery<PostResponse, Error>({
    queryKey: ['posts', params],
    queryFn: () => getPostApi(params),
    enabled: !!token,
  });
}
export function useAddPost() {
  return useMutation<Post, Error, CreatePostDto>({
    mutationFn: (data: CreatePostDto) => addPostApi(data),
    onSuccess: async () => {
      // 모든 관련 쿼리 무효화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
      ]);

      // userInfo 강제 리페치
      await queryClient.refetchQueries({ queryKey: ['userInfo'] });
    },
    onError: (error) => {
      console.error('Add post error:', error);
    },
  });
}
