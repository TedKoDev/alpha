import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getPostApi, PostParams } from '~/services/postService';
import { useAuthStore } from '~/store/authStore';

export function usePosts(params?: PostParams) {
  const token = useAuthStore((state) => state.userToken);

  return useQuery<string[], Error>({
    queryKey: ['posts'],
    queryFn: () => getPostApi(params),

    enabled: !!token, // 토큰이 있을 때만 쿼리 실행
    onSuccess: (data: any) => {
      console.log('API 응답:', data);
    },
    onError: (error: any) => {
      console.error('API 에러:', error);
    },
  } as UseQueryOptions<string[], Error>);
}
