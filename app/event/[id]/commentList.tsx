import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

import CommentInput from './components/CommentInput';
import CommentItem from './components/CommentItem';

import {
  useComments,
  useDeleteComment,
  useUpdateComment,
} from '~/queries/hooks/comments/useComments';
import { useToggleCommentLike } from '~/queries/hooks/useLikes';

export default function CommentListPage() {
  const { id } = useLocalSearchParams();
  const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('latest');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useComments(
    Number(id),
    sort
  );

  const allComments = data?.pages.flatMap((page) => page.data) ?? [];
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

  const renderSortButton = (type: 'latest' | 'oldest' | 'popular', label: string) => (
    <TouchableOpacity
      onPress={() => setSort(type)}
      className={`rounded-full px-3 py-1 ${sort === type ? 'bg-purple-100' : 'bg-gray-100'}`}>
      <Text className={sort === type ? 'text-purple-600' : 'text-gray-600'}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerTitle: '댓글',
            headerBackTitle: '',
            headerTintColor: '#D812DC',
          }}
        />

        <View className="mb-4 flex-row justify-end gap-2 border-b border-gray-200 px-4 py-4">
          {renderSortButton('latest', 'Latest')}
          {renderSortButton('oldest', 'Oldest')}
          {renderSortButton('popular', 'Popular')}
        </View>

        <View className="flex-1">
          <FlatList
            data={allComments}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
            renderItem={({ item }) => (
              <CommentItem
                comment={item}
                onToggleLike={handleToggleLike}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
              />
            )}
            keyExtractor={(item) => item.comment_id.toString()}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isFetchingNextPage ? (
                <View className="py-4">
                  <ActivityIndicator color="#B227D4" />
                </View>
              ) : null
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: Platform.OS === 'ios' ? 130 : 80, // CommentInput 높이만큼 패딩 추가
            }}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'red',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
            zIndex: 1000,
          }}>
          <CommentInput postId={Number(id)} />
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}
