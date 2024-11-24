import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeService } from '~/services/likeService';

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likeService.togglePostLike(postId),
    onSuccess: (_, postId) => {
      // 게시글 좋아요 상태를 업데이트하기 위해 invalidateQueries 호출
      queryClient.invalidateQueries(['post', postId]);
    },
    onError: (error) => {
      console.error('Toggle post like error:', error);
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => likeService.toggleCommentLike(commentId),
    onSuccess: (_, commentId) => {
      // 댓글 좋아요 상태를 업데이트하기 위해 invalidateQueries 호출
      queryClient.invalidateQueries(['comments']);
    },
    onError: (error) => {
      console.error('Toggle comment like error:', error);
    },
  });
};
