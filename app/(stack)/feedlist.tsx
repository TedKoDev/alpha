import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Button,
} from 'react-native';

import EventListingItem from '~/components/EventListingItem';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={allPosts}
        renderItem={({ item }) => <EventListingItem event={item} />}
        keyExtractor={(item) => item.post_id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f4f4f4' }} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListFooterComponent={() =>
          isLoading ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === 'android' ? 16 : 0,
        }}
      />
    </SafeAreaView>
  );
}
