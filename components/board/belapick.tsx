import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import EventListItem from '../EventListingItem';
import EventSmallListItem from '../EventsmallListingItem';
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
  });

  const { cachedPosts, setCachedPosts } = useBoardStore();
  const postItems = cachedPosts.bella.length > 0 ? cachedPosts.bella : posts?.pages[0]?.data || [];

  useEffect(() => {
    if (posts?.pages[0]?.data) {
      setCachedPosts('bella', posts.pages[0].data);
    }
  }, [posts]);

  return (
    <View className="pt-5 ">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Bella's Pick</Text>
          <Text className="ml-2 text-xl text-[#B227D4]">✓</Text>
        </View>
        <Link href="/board/bella-picks" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF6B6B]">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Posts List */}
      <View>
        {postItems.map((event) => (
          <EventSmallListItem key={event.post_id} event={event} />
        ))}
      </View>
    </View>
  );
}
