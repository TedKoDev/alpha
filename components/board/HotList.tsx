import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import EventSmallListItem from '../EventsmallListingItem';

import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useBoardStore } from '~/store/boardStore';

export default function HotList() {
  const { data: posts } = usePosts({
    page: 1,
    limit: 5,
    sort: 'popular',
  });

  const { cachedPosts, setCachedPosts } = useBoardStore();
  const postItems = cachedPosts.hot.length > 0 ? cachedPosts.hot : posts?.pages[0]?.data || [];

  useEffect(() => {
    if (posts?.pages[0]?.data) {
      setCachedPosts('hot', posts.pages[0].data);
    }
  }, [posts]);

  return (
    <View className="pt-5">
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Hot Posts</Text>
          <Text className="ml-2 text-xl text-[#B227D4]">🔥</Text>
        </View>
        <Link href="/board/hot" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF6B6B]">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View>
        {postItems.map((event) => (
          <EventSmallListItem key={event.post_id} event={event} />
        ))}
      </View>
    </View>
  );
}
