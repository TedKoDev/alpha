import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { commentService, PaginationQueryDto } from '~/services/commentService';
import { likeService } from '~/services/likeService';

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
        queryClient.refetchQueries({ queryKey: ['comments', variables.postId] }),
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

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeService.toggleCommentLike,
    onSuccess: async (_, commentId) => {
      // 댓글이 속한 게시물의 ID를 알아야 정확한 쿼리 무효화가 가능합니다
      // 현재 캐시된 데이터에서 해당 댓글의 게시물 ID를 찾습니다
      const queries = queryClient.getQueriesData<any>({ queryKey: ['comments'] });
      console.log('queries', queries);

      for (const [queryKey] of queries) {
        const [_, postId] = queryKey;
        if (postId) {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
            queryClient.refetchQueries({ queryKey: ['comments', postId] }),
          ]);
        }
      }

      // 관련된 다른 쿼리들도 업데이트
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['post'] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
      ]);
    },
    // 낙관적 업데이트를 위한 옵션 (선택사항)
    onMutate: async (commentId) => {
      // 현재 캐시된 데이터에서 해당 댓글을 찾아 좋아요 상태를 즉시 토글
      const queries = queryClient.getQueriesData<any>({ queryKey: ['comments'] });

      for (const [queryKey, data] of queries) {
        if (data?.pages) {
          const updatedPages = data.pages.map((page: any) => ({
            ...page,
            data: page.data.map((comment: any) => {
              if (comment.comment_id === commentId) {
                return {
                  ...comment,
                  user_liked: !comment.user_liked,
                  likes: comment.user_liked ? comment.likes - 1 : comment.likes + 1,
                };
              }
              return comment;
            }),
          }));

          queryClient.setQueryData(queryKey, {
            ...data,
            pages: updatedPages,
          });
        }
      }
    },
  });
};

export const useSelectAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.selectAsAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
