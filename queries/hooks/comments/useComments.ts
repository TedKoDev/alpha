import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { commentService } from '~/services/commentService';

export const useComments = (postId: number) => {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => commentService.getComments(postId, pageParam),
    getNextPageParam: (lastPage: { data: any[]; limit: number; page: number }) => {
      if (lastPage.data.length < lastPage.limit) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['post', variables.postId]);
      queryClient.invalidateQueries(['comments', variables.postId]);
    },
    onError: (error) => {
      console.error('Create comment error:', error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.deleteComment,
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries(['comments']);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      commentService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
};
