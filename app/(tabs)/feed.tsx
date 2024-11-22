import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { queryClient } from '~/queries/queryClient';

export default function Feed() {
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
  });

  console.log('postsData', JSON.stringify(postsData, null, 2));

  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ListLayout
      headerTitle="커뮤니티"
      data={allPosts}
      showViewToggle
      showWriteButton
      hideButton
      isLoading={isFetchingNextPage}
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={refetch}
      isRefreshing={isRefetching}
    />
  );
}
