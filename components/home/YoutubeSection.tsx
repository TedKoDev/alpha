import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';

import YoutubePlayerModal from '~/components/youtube/YoutubePlayerModal';
import { useYoutubeLinks } from '~/queries/hooks/youtube/useYoutubeLinks';

export default function YoutubeSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  // console.log('selectedViedeo', selectedVideo);
  const { data: youtubeItems, isLoading: youtubeLinkLoading, error } = useYoutubeLinks();

  const handleVideoPress = useCallback((videoId: string) => {
    console.log('pressed ', videoId);
    setSelectedVideo(videoId);
  }, []);

  if (youtubeLinkLoading) {
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
      <View className="mb-3  flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Image
            source={require('~/assets/images/youtube.png')}
            className="mr-2 h-6 w-6"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold">Youtube</Text>
        </View>
        <Pressable onPress={() => router.push('/youtube-list')}>
          <Text className="text-orange-500">See More {'>'}</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}>
        {displayItems.map((item) => (
          <View key={item.id} className="mr-3" style={{ width: 280 }}>
            <Pressable onPress={() => handleVideoPress(item.videoId)}>
              <Image
                source={{ uri: item.thumbnail }}
                className="mb-2 rounded-lg"
                style={{ width: '100%', height: 200 }}
              />
              <Text className="font-medium" numberOfLines={2}>
                {item.title}
              </Text>
              {item.topic && <Text className="text-sm text-gray-600">{item.topic}</Text>}
              <Text className="text-gray-500">{item.channel}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <YoutubePlayerModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </View>
  );
}
