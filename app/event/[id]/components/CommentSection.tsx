import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';

import CommentItem from './CommentItem';

import {
  useComments,
  useDeleteComment,
  useUpdateComment,
  useSelectAnswer,
} from '~/queries/hooks/comments/useComments';
import { useToggleCommentLike } from '~/queries/hooks/useLikes';
import { useAuthStore } from '~/store/authStore';

dayjs.extend(relativeTime);

export default function CommentSection({
  postId,
  postType,
  authorId,
  post_user_id,
}: {
  postId: number;
  postType?: string;
  authorId?: number;
  post_user_id?: number;
}) {
  const router = useRouter();
  const toggleCommentLikeMutation = useToggleCommentLike();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useUpdateComment();
  const selectAnswerMutation = useSelectAnswer();
  const { userInfo } = useAuthStore();

  // console.log('post_user_id', post_user_id);
  // console.log('userInfo', userInfo);

  // 최신 댓글 5개만 가져오기
  const { data } = useComments(postId, 'latest');
  console.log('data', JSON.stringify(data, null, 2));
  const comments = data?.pages[0]?.data.slice(0, 5) ?? [];
  const comment_count = data?.pages[0]?.total ?? 0;

  // 채택된 답변이 맨 위로 오도록 정렬
  const sortedComments = React.useMemo(() => {
    return [...(data?.pages[0]?.data ?? [])].sort((a, b) => {
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
      return 0;
    });
  }, [data]);

  const handleToggleLike = (commentId: number) => {
    console.log('commentIdfor like', commentId);
    toggleCommentLikeMutation.mutate(commentId);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleEditComment = (commentId: number, newContent: string) => {
    editCommentMutation.mutate({ commentId, content: newContent });
  };

  const handleSelectAnswer = async (commentId: number) => {
    try {
      console.log('commentId', commentId);
      await selectAnswerMutation.mutateAsync(commentId);
      Alert.alert('성공', '답변이 채택되었습니다.');
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.message || '답변 채택에 실패했습니다.');
    }
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
          {sortedComments.map((comment: any) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              post_type={postType}
              isQuestionAuthor={userInfo?.user_id === post_user_id}
              onToggleLike={handleToggleLike}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onSelectAnswer={handleSelectAnswer}
              sortedComments={sortedComments}
            />
          ))}
        </View>
      )}
    </View>
  );
}
