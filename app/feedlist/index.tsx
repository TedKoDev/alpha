import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';

export default function FeedList() {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 15,
    sort: 'latest',
    type: 'SENTENCE',
  });

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <ListLayout
      headerTitle="Today's Vocabulary"
      data={allPosts}
      showViewToggle={false}
      showWriteButton
      writeRoute="/write/with-words"
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={refetch}
      isRefreshing={isRefetching}
      isLoading={isLoading}
    />
  );
}
