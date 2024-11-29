import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import EventSmallListItem from '../EventsmallListingItem';

import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useBoardStore } from '~/store/boardStore';

interface Post {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  location: string;
}

export default function BelaPick() {
  const { data: posts, isLoading: postsLoading } = usePosts({
    page: 1,
    limit: 5,
    sort: 'latest',
    admin_pick: true,
    topicId: undefined,
    categoryId: undefined,
  });

  const { cachedPosts, setCachedPosts } = useBoardStore();
  const postItems = cachedPosts.Bera.length > 0 ? cachedPosts.Bera : posts?.pages[0]?.data || [];

  useEffect(() => {
    if (posts?.pages[0]?.data) {
      setCachedPosts('Bera', posts.pages[0].data);
    }
  }, [posts]);

  return (
    <View className="pt-5 ">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Bera's Pick</Text>
          <Text className="ml-2 text-xl text-[#B227D4]">✓</Text>
        </View>
        <Link href="/board/Bera-picks" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF6B6B]">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Posts List */}
      <View>
        {[...Array(5)].map((_, index) => {
          const event = postItems[index];
          if (event) {
            return <EventSmallListItem key={`event-${event.post_id}`} event={event} />;
          }
          return <View key={`skeleton-${index}`} className="h-[72px] animate-pulse bg-white" />;
        })}
      </View>
    </View>
  );
}
