import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getWordApi } from '~/services/wordService';
import { useAuthStore } from '~/store/authStore';

export function useWords() {
  const token = useAuthStore((state) => state.userToken);

  return useQuery<string[], Error>({
    queryKey: ['todayWords'],
    queryFn: () => getWordApi(), // token을 전달하는 경우
    enabled: !!token, // 토큰이 있을 때만 쿼리 실행
    onSuccess: (data: any) => {
      console.log('API 응답:', data);
    },
    onError: (error: any) => {
      console.error('API 에러:', error);
    },
  } as UseQueryOptions<string[], Error>);
}
