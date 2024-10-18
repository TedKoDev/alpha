import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { tw } from 'nativewind';

// 유튜브 영상 데이터
const videos = [
  {
    id: '1',
    title: 'Learn Korean - Lesson 1',
    thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_1/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_1',
  },
  {
    id: '2',
    title: 'Learn Korean - Lesson 2',
    thumbnail: 'https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_2/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_2',
  },
  // 추가적인 영상 데이터...
];

export default function Index() {
  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`mb-4 p-4 bg-white rounded-lg shadow-md`}
      onPress={() => openVideo(item.url)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={tw`w-full h-48 rounded-lg mb-2`}
        resizeMode="cover"
      />
      <Text style={tw`text-lg font-bold text-gray-800`}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>Korean Lessons</Text>
      <FlatList data={videos} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}
