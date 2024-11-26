import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { useYoutubeLinks } from '~/queries/hooks/youtube/useYoutubeLinks';

export default function YoutubeSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isWebViewError, setIsWebViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: youtubeItems, isLoading: youtubeLinkLoading, error } = useYoutubeLinks();

  const handleVideoPress = useCallback((videoId: string) => {
    setIsWebViewError(false);
    setIsLoading(true);
    setSelectedVideo(videoId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
    setIsWebViewError(false);
    setIsLoading(true);
  }, []);

  const handleExternalOpen = useCallback((videoId: string) => {
    const youtubeUrl = `vnd.youtube://${videoId}`;
    const webUrl = `https://www.youtube.com/watch?v=${videoId}`;

    Linking.canOpenURL(youtubeUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(youtubeUrl);
        }
        return Linking.openURL(webUrl);
      })
      .catch(() => Linking.openURL(webUrl));
  }, []);

  const handleRetry = useCallback(() => {
    if (!selectedVideo) return;
    setIsWebViewError(false);
    setIsLoading(true);
    const currentVideo = selectedVideo;
    setSelectedVideo(null);
    setTimeout(() => setSelectedVideo(currentVideo), 100);
  }, [selectedVideo]);

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
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold">Youtube 📸</Text>
        <Pressable onPress={() => router.push('/youtube-list')}>
          <Text className="text-gray-500">See More {'>'}</Text>
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
                source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
                className="mb-2 rounded-lg"
                style={{ width: '100%', height: 200 }}
              />
              <Text className="font-medium" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-gray-500">{item.channel}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedVideo}
        onRequestClose={handleCloseModal}
        animationType="fade"
        statusBarTranslucent>
        <SafeAreaView className="flex-1 bg-black">
          <View className="absolute left-0 right-0 top-24 z-50 flex-row items-center justify-between p-4">
            <Pressable
              onPress={handleCloseModal}
              hitSlop={{ top: 35, bottom: 35, left: 15, right: 15 }}
              className="mt-5 flex-row items-center rounded-full bg-black/50 px-4 py-2">
              <Ionicons name="close" size={24} color="white" />
              <Text className="ml-1 text-base font-medium text-white">닫기</Text>
            </Pressable>

            <Pressable
              onPress={() => selectedVideo && handleExternalOpen(selectedVideo)}
              hitSlop={{ top: 35, bottom: 35, left: 15, right: 15 }}
              className="rounded-full bg-black/50 p-2">
              <Ionicons name="open-outline" size={24} color="white" />
            </Pressable>
          </View>

          {selectedVideo && (
            <View className="flex-1 justify-center">
              {isLoading && (
                <View className="absolute inset-0 z-10 items-center justify-center bg-black">
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}

              {isWebViewError ? (
                <View className="items-center justify-center p-4">
                  <Text className="mb-4 text-center text-white">
                    동영상을 불러오는데 실패했습니다.
                  </Text>
                  <Pressable onPress={handleRetry} className="rounded-full bg-white px-6 py-2">
                    <Text className="font-medium">다시 시도</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => selectedVideo && handleExternalOpen(selectedVideo)}
                    className="mt-4 rounded-full bg-red-500 px-6 py-2">
                    <Text className="font-medium text-white">브라우저에서 열기</Text>
                  </Pressable>
                </View>
              ) : (
                <WebView
                  source={{
                    uri: `https://www.youtube.com/embed/${selectedVideo}?playsinline=1&rel=0&showinfo=0&modestbranding=1`,
                  }}
                  style={{ flex: 1, backgroundColor: 'black' }}
                  mediaPlaybackRequiresUserAction={false}
                  allowsFullscreenVideo
                  javaScriptEnabled
                  domStorageEnabled
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                  onError={() => setIsWebViewError(true)}
                  startInLoadingState={false}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}
