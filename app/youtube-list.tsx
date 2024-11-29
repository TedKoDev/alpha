import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';

import YoutubePlayerModal from '~/components/youtube/YoutubePlayerModal';
import { useYoutubeLinks } from '~/queries/hooks/youtube/useYoutubeLinks';

export default function YoutubeList() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { data: youtubeItems, isLoading: youtubeLinkLoading, error } = useYoutubeLinks();

  const handleSubscribe = (channelId: string) => {
    Linking.openURL(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`);
  };

  if (youtubeLinkLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !youtubeItems) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">데이터를 불러오는데 실패했습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-white">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex-row items-center">
              <Image
                source={require('~/assets/images/youtube.png')}
                className="mr-2 h-6 w-6"
                resizeMode="contain"
              />
              <Text>YouTube</Text>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => handleSubscribe('UCnV92PH-m2oxVD-jXIggNkQ')}
              className="mr-4 rounded-full bg-red-600 px-4 py-1.5">
              <Text className="text-sm font-medium text-white">Subscribe</Text>
            </Pressable>
          ),
        }}
      />
      <View className="p-4">
        {youtubeItems.map((item) => (
          <View key={item.id} className="mb-6 border-b border-gray-200 pb-4">
            <Pressable onPress={() => setSelectedVideo(item.videoId)}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
                className="mb-2 rounded-lg"
                style={{ width: '100%', height: 200 }}
              />
              <Text className="font-medium" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-gray-500">{item.channel}</Text>
            </Pressable>

            {/* <Pressable
              onPress={() => handleSubscribe(item.channelId)}
              className="mt-2 self-start rounded-full bg-red-600 px-4 py-1.5">
              <Text className="text-sm font-medium text-white">구독하기</Text>
            </Pressable> */}
          </View>
        ))}
      </View>
      <View className="mt-10">
        <YoutubePlayerModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />
      </View>
    </ScrollView>
  );
}
