import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';

import { queryClient } from '~/queries/queryClient';
import {
  addPostApi,
  CreatePostDto,
  getPostApi,
  getPostByIdApi,
  postService,
  UpdatePostDto,
} from '~/services/postService';

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

type UsePostsParams = {
  page: number;
  limit: number;
  sort: string;
  type?: string;
};

export function usePosts(params: UsePostsParams) {
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam = 1 }) =>
      getPostApi({
        ...params,
        page: pageParam,
        sort: params.sort as 'latest' | 'oldest' | 'popular',
        type: params.type as 'SENTENCE' | 'COLUMN' | 'QUESTION' | 'GENERAL',
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === params.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
export function useGetPostById(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostByIdApi(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
}

export function useAddPost() {
  return useMutation<Post, Error, CreatePostDto>({
    mutationFn: (data: CreatePostDto) => addPostApi(data),

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistic update
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old?.pages?.[0]) return old;

        const optimisticPost = {
          post_id: Date.now(),
          ...newPost,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [optimisticPost, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousPosts };
    },

    onSuccess: async () => {
      // 모든 관련 쿼리 무효화 및 리페치
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'], exact: true }),
      ]);
    },
  });
}

// Update Post Hook
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, ...updateData }: UpdatePostDto & { postId: number }) =>
      postService.updatePost(postId, updateData),
    onSuccess: async (_, variables) => {
      // 1. 이미지 캐시 클리어
      await Image.clearMemoryCache();
      await Image.clearDiskCache();

      // 2. 쿼리 무효화 및 리프레시
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', variables.postId] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['post', variables.postId] }),
        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] }),
        queryClient.refetchQueries({ queryKey: ['comments', variables.postId] }),

        // queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.refetchQueries({ queryKey: ['logs'] }),
        // queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'] }),
      ]);
    },
    onError: (error) => {
      console.error('Update post failed:', error);
    },
  });
};

// Delete Post Hook
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
    onSuccess: async () => {
      // 모든 관련 쿼리 무효화 및 리프레시
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.refetchQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'], exact: true }),
      ]);
    },
  });
};
