import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { View, Text } from 'react-native';

import { useDeleteComment, useUpdateComment } from '~/queries/hooks/comments/useComments';
import { useToggleCommentLike } from '~/queries/hooks/useLikes';
import CommentItem from './CommentItem';

dayjs.extend(relativeTime);

export default function CommentSection({ postId, comments = [] }: any) {
  const toggleCommentLikeMutation = useToggleCommentLike();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useUpdateComment();

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
      <Text className="mb-4 text-lg font-bold">Comments ({comments.length})</Text>

      {comments.length === 0 ? (
        <Text className="text-center text-gray-500">No comments yet.</Text>
      ) : (
        comments.map((comment: any) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            onToggleLike={handleToggleLike}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))
      )}
    </View>
  );
}
