import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getConsultationsApi, getConsultationByIdApi } from '~/services/postService';
import { useAuthStore } from '~/store/authStore';

export function useConsultations(params: { page: number; limit: number }) {
  return useInfiniteQuery({
    queryKey: ['consultations', params],
    queryFn: ({ pageParam = 1 }) =>
      getConsultationsApi({
        page: pageParam,
        limit: params.limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === params.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

export function useConsultationById(id: number) {
  return useQuery({
    queryKey: ['consultation', id],
    queryFn: () => getConsultationByIdApi(id),
    enabled: !!id,
  });
}

export function useMyConsultations(params: { page: number; limit: number }) {
  const userInfo = useAuthStore((state) => state.userInfo);

  return useInfiniteQuery({
    queryKey: ['myConsultations', params],
    queryFn: ({ pageParam = 1 }) =>
      getConsultationsApi({
        page: pageParam,
        limit: params.limit,
      }),
    enabled: !!userInfo?.user_id,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === params.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
