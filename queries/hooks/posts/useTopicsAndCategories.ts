import { useQuery } from '@tanstack/react-query';
import { getTopicsApi } from '~/services/postService';

interface TopicWithCategories {
  topic_id: number;
  title: string;
  category: {
    category_id: number;
    category_name: string;
  }[];
}

export function useTopics() {
  return useQuery<TopicWithCategories[]>({
    queryKey: ['topics'],
    queryFn: getTopicsApi,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    retry: 2, // 실패시 2번 재시도
  });
}
