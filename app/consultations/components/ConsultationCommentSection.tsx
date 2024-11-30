import { format } from 'date-fns';
import { Image } from 'expo-image';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {
  useComments,
  useDeleteComment,
  useUpdateComment,
} from '~/queries/hooks/comments/useComments';
import { useAuthStore } from '~/store/authStore';

interface ConsultationCommentSectionProps {
  postId: number;
  onEdit: (commentId: number, content: string) => void;
  onConfirm: (commentId: number) => void;
  status: string;
  confirmedCommentId?: number | null;
}

export default function ConsultationCommentSection({
  postId,
  onEdit,
  onConfirm,
  status,
}: ConsultationCommentSectionProps) {
  const { userInfo } = useAuthStore();
  console.log('userInfo', userInfo);
  const isTeacher = userInfo?.role === 'TEACHER';
  console.log('isTeacher', isTeacher);
  const deleteCommentMutation = useDeleteComment();
  const { data } = useComments(postId, 'latest');
  const comments = data?.pages[0]?.data ?? [];

  // 채택된 답변이 맨 위로 오도록 정렬
  const sortedComments = React.useMemo(() => {
    return [...comments].sort((a, b) => {
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
      return 0;
    });
  }, [comments]);

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  return (
    <View className="mb-16 mt-4 border-t border-gray-200 p-4">
      <Text className="mb-4 text-lg font-bold">답변</Text>
      {sortedComments && sortedComments.length > 0 ? (
        sortedComments.map((comment: any) => (
          <View
            key={comment.comment_id}
            className="mb-4 border-b border-gray-100 pb-4 last:border-b-0">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: comment.user?.profile_picture_url || undefined }}
                  className="h-8 w-8 rounded-full bg-gray-200"
                  contentFit="cover"
                />
                <View className="ml-2">
                  <Text className="font-bold">{comment.user?.username}</Text>
                  <Text className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), 'yyyy.MM.dd HH:mm')}
                  </Text>
                </View>
              </View>
              {comment.isSelected && (
                <View className="rounded-lg bg-green-100 px-2 py-1">
                  <Text className="text-green-600">채택된 답변</Text>
                </View>
              )}
            </View>
            <Text className="mt-2 text-gray-700">{comment.content}</Text>
            {comment.user?.user_id === userInfo?.user_id && (
              <View className="mt-2 flex-row justify-end">
                <TouchableOpacity
                  onPress={() => onEdit(comment.comment_id, comment.content)}
                  className="mr-2">
                  <Text className="text-blue-500">수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleCommentDelete(comment.comment_id)}
                  className="mr-2">
                  <Text className="text-red-500">삭제</Text>
                </TouchableOpacity>
                {isTeacher &&
                  status !== 'COMPLETED' &&
                  !sortedComments.some((c) => c.isSelected) && (
                    <TouchableOpacity
                      onPress={() => onConfirm?.(comment.comment_id)}
                      className="rounded-lg bg-green-500 px-3 py-1">
                      <Text className="text-white">답변 확정</Text>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-8">
          <Text className="text-gray-500">아직 답변이 없습니다.</Text>
          <Text className="mt-1 text-sm text-gray-400">선생님의 답변을 기다려주세요!</Text>
        </View>
      )}
    </View>
  );
}
