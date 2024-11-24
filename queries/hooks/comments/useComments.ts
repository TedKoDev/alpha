import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { commentService, PaginationQueryDto } from '~/services/commentService';

export const useComments = (postId: number, sort: 'latest' | 'oldest' | 'popular' = 'latest') => {
  return useInfiniteQuery({
    queryKey: ['comments', postId, sort],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const queryDto: PaginationQueryDto = {
          page: Number(pageParam),
          limit: Number(15),
          sort,
          postId: Number(postId),
        };
        console.log('Fetching comments with:', queryDto);
        const response = await commentService.getComments({
          ...queryDto,
          postId: Number(postId),
        });
        console.log('Response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      if (lastPage.page >= totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.createComment,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['post', variables.postId] }),
        queryClient.refetchQueries({ queryKey: ['post', variables.postId] }),

        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'] }),
      ]);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.deleteComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['comments'] }),
        queryClient.invalidateQueries({ queryKey: ['post'] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'] }),
      ]);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      commentService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
