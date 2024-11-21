import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';
import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { queryClient } from '~/queries/queryClient';

export default function Feed() {
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>('list');

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

  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  useFocusEffect(
    useCallback(() => {
      const currentTime = Date.now();
      if (
        currentTime - lastRefreshTime > 30000 ||
        queryClient.getQueryState(['posts'])?.isInvalidated
      ) {
        refetch();
        setLastRefreshTime(currentTime);
      }
    }, [refetch, lastRefreshTime])
  );

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'list' ? 'instagram' : 'list'));
  }, []);

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
