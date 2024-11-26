import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

import CommentItem from './CommentItem';

import {
  useComments,
  useDeleteComment,
  useUpdateComment,
} from '~/queries/hooks/comments/useComments';
import { useToggleCommentLike } from '~/queries/hooks/useLikes';

dayjs.extend(relativeTime);

export default function CommentSection({ postId }: { postId: number }) {
  const router = useRouter();
  const toggleCommentLikeMutation = useToggleCommentLike();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useUpdateComment();

  // 최신 댓글 5개만 가져오기
  const { data } = useComments(postId, 'latest');
  const comments = data?.pages[0]?.data.slice(0, 5) ?? [];
  const comment_count = data?.pages[0]?.total ?? 0;

  const handleToggleLike = (commentId: number) => {
    toggleCommentLikeMutation.mutate(commentId);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleEditComment = (commentId: number, newContent: string) => {
    editCommentMutation.mutate({ commentId, content: newContent });
  };

  return (
    <View className="mt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold">Comments ({comment_count})</Text>
        {comment_count > 3 && (
          <TouchableOpacity onPress={() => router.push(`/event/${postId}/commentList`)}>
            <Text className="text-purple-600">see all</Text>
          </TouchableOpacity>
        )}
      </View>

      {comment_count === 0 ? (
        <Text className="text-center text-gray-500">No comments yet.</Text>
      ) : (
        <View style={{ paddingBottom: Platform.OS === 'ios' ? 130 : 80 }}>
          {comments.map((comment: any) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              onToggleLike={handleToggleLike}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
            />
          ))}
        </View>
      )}
    </View>
  );
}
