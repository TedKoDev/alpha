import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { View, Text, Modal, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useState, useCallback } from 'react';

interface Props {
  videoId: string | null;
  onClose: () => void;
}

export default function YoutubePlayerModal({ videoId, onClose }: Props) {
  const [isWebViewError, setIsWebViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleExternalOpen = useCallback((id: string) => {
    const youtubeUrl = `vnd.youtube://${id}`;
    const webUrl = `https://www.youtube.com/watch?v=${id}`;

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
    if (!videoId) return;
    setIsWebViewError(false);
    setIsLoading(true);
  }, [videoId]);

  return (
    <Modal visible={!!videoId} onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <SafeAreaView className="flex-1 bg-black">
        <View className="absolute left-0 right-0 top-0 z-50 flex-row items-center justify-between p-4">
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className=" mt-24 flex-row items-center rounded-full bg-black/50 px-4 py-2">
            <Ionicons name="close" size={24} color="white" />
            <Text className="ml-1 text-base font-medium text-white">닫기</Text>
          </Pressable>

          <Pressable
            onPress={() => videoId && handleExternalOpen(videoId)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="rounded-full bg-black/50 p-2">
            <Ionicons name="open-outline" size={24} color="white" />
          </Pressable>
        </View>

        {videoId && (
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
                  onPress={() => videoId && handleExternalOpen(videoId)}
                  className="mt-4 rounded-full bg-red-500 px-6 py-2">
                  <Text className="font-medium text-white">브라우저에서 열기</Text>
                </Pressable>
              </View>
            ) : (
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&showinfo=0&modestbranding=1&autoplay=1`,
                }}
                style={{ flex: 1, backgroundColor: 'black' }}
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => setIsWebViewError(true)}
                startInLoadingState={true}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
