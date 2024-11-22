import { useQueryClient } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import EditGeneral from './components/EditGeneral';
import EditSentence from './components/EditSentence';

import { useGetPostById } from '~/queries/hooks/posts/usePosts';

export default function EditPostScreen() {
  const { id } = useLocalSearchParams();
  const postId = Number(id);
  const { data: post, isLoading } = useGetPostById(postId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  if (!post) {
    return null;
  }

  // 포스트 타입에 따라 다른 수정 화면 렌더링
  const renderEditComponent = () => {
    switch (post.type) {
      case 'SENTENCE':
        return <EditSentence post={post} />;
      case 'GENERAL':
      case 'COLUMN':
      case 'QUESTION':
        return <EditGeneral post={post} />;
      default:
        return <EditGeneral post={post} />;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Edit Post',
          headerTitleAlign: 'center',
          headerTintColor: '#D812DC',
          headerStyle: { backgroundColor: 'white' },
        }}
      />
      {renderEditComponent()}
    </>
  );
}
