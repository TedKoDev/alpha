import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';

export default function BellaPicksScreen() {
  const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('latest');

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 10,
    sort,
    admin_pick: true,
  });

  const postItems = posts?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const renderSortButton = (type: 'latest' | 'oldest' | 'popular', label: string) => (
    <TouchableOpacity
      onPress={() => setSort(type)}
      className={`rounded-full px-3 py-1 ${sort === type ? 'bg-purple-100' : 'bg-gray-100'}`}>
      <Text className={sort === type ? 'text-purple-600' : 'text-gray-600'}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Bella's Pick",
          headerTitleAlign: 'center',
          headerTintColor: '#D812DC',
        }}
      />

      {/* Sort Buttons */}
      <View className="mb-4 flex-row justify-end gap-2 border-b border-gray-200 px-4 py-4">
        {renderSortButton('latest', 'Latest')}
        {renderSortButton('oldest', 'Oldest')}
        {renderSortButton('popular', 'Popular')}
      </View>

      <ListLayout
        headerTitle=""
        data={postItems}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        showViewToggle={true}
        hideButton={true}
        showWriteButton={false}
        hideHeader={true}
      />
    </View>
  );
}
