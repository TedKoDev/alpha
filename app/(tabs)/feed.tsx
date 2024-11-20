import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';

// 임시 데이터
const posts = [
  {
    id: '1',
    author: '커직이',
    title: '지금 숙대 앞에서 열리는 베스트 브레드 여행! 5선!',
    content:
      '여행은 사람을 설레게 죽이는 시사회며, 즐거운 경험이 있다고 나는 시간 동안 보스트레이는 여행자가 가져가야 할 것이기 때문에 모든 여행자를 살펴보 보겠습니다.',
    datetime: new Date().toISOString(),
    image: null,
    views: 23,
    comments: 9,
    likes: 32,
  },
  // ... 더 많은 포스트
];

export default function Feed() {
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>('list');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'instagram' : 'list'));
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '커뮤니티',
          headerRight: () => (
            <TouchableOpacity onPress={toggleViewMode} className="mr-4">
              <Feather name={viewMode === 'list' ? 'grid' : 'list'} size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={posts}
        key={viewMode}
        renderItem={({ item }) =>
          viewMode === 'list' ? (
            <EventListingItem event={item} />
          ) : (
            <InstagramStyleItem event={item} />
          )
        }
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-100" />}
      />
    </View>
  );
}
