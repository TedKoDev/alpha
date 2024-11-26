import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as Linking from 'expo-linking';
import { useYoutubeLinks } from '~/queries/hooks/youtube/useYoutubeLinks';

export default function YoutubeSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { data: youtubeItems, isLoading, error } = useYoutubeLinks();

  const handleSubscribe = (channelId: string) => {
    Linking.openURL(`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`);
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-3">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !youtubeItems) {
    return (
      <View className="items-center justify-center py-3">
        <Text className="text-red-500">데이터를 불러오는데 실패했습니다.</Text>
      </View>
    );
  }

  const displayItems = youtubeItems.slice(0, 5);

  return (
    <View className="py-3">
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold">카페 vlog 📸</Text>
        <Pressable onPress={() => router.push('/youtube-list')}>
          <Text className="text-gray-500">더보기 {'>'}</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}>
        {displayItems.map((item) => (
          <View key={item.id} className="mr-3" style={{ width: 280 }}>
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

            <Pressable
              onPress={() => handleSubscribe(item.channelId)}
              className="mt-2 self-start rounded-full bg-red-600 px-4 py-1.5">
              <Text className="text-sm font-medium text-white">구독하기</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedVideo}
        onRequestClose={() => setSelectedVideo(null)}
        animationType="slide">
        <View className="flex-1 bg-black">
          <YoutubePlayer height={300} videoId={selectedVideo!} play />
          <Pressable className="absolute right-5 top-10" onPress={() => setSelectedVideo(null)}>
            <Text className="text-lg text-white">닫기</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
