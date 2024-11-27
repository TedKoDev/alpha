import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Props {
  videoId: string | null;
  onClose: () => void;
}

export default function YoutubePlayerModal({ videoId, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [key, setKey] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    return () => {
      setPlayerReady(false);
      setIsLoading(true);
      setIsError(false);
    };
  }, []);

  useEffect(() => {
    if (videoId) {
      console.log('Video ID changed:', videoId);
      setIsLoading(true);
      setIsError(false);
      setKey(Date.now());
    }
  }, [videoId]);

  const onError = useCallback((error: any) => {
    console.log('YouTube Player Error:', error);
    setIsError(true);
    setIsLoading(false);
  }, []);

  const onReady = useCallback(() => {
    console.log('YouTube Player Ready');
    setPlayerReady(true);
    setIsLoading(false);
    setIsError(false);
  }, []);

  const handleWebViewLoad = useCallback(() => {
    console.log('WebView Load Complete');
    setTimeout(() => {
      if (!playerReady) {
        console.log('Retrying player initialization...');
        setKey(Date.now());
      }
    }, 3000);
  }, [playerReady]);

  return (
    <Modal visible={!!videoId} onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <SafeAreaView className="flex-1 bg-black">
        <View className="absolute left-0 right-0 top-24 z-50 flex-row items-center justify-between p-4">
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 35, bottom: 35, left: 15, right: 15 }}
            className="mt-5 flex-row items-center rounded-full bg-black/50 px-4 py-2">
            <Ionicons name="close" size={24} color="white" />
            <Text className="ml-1 text-base font-medium text-white">닫기</Text>
          </Pressable>

          <Pressable
            onPress={() => videoId && handleExternalOpen(videoId)}
            hitSlop={{ top: 35, bottom: 35, left: 15, right: 15 }}
            className="rounded-full bg-black/50 p-2">
            <Ionicons name="open-outline" size={24} color="white" />
          </Pressable>
        </View>

        {videoId && (
          <View className="flex-1 justify-center">
            <View key={key} className="h-[300px] bg-black">
              <YoutubePlayer
                height={300}
                play={playerReady && !isLoading && !isError}
                videoId={videoId}
                onReady={onReady}
                onError={onError}
                onChangeState={(state) => {
                  console.log('Player State:', state);
                }}
                initialPlayerParams={{
                  preventFullScreen: false,
                  showClosedCaptions: false,
                  modestbranding: true,
                  rel: false,
                  controls: true,
                  autoplay: 1,
                }}
                webViewProps={{
                  androidLayerType: Platform.select({
                    android: 'hardware',
                    ios: undefined,
                  }),
                  startInLoadingState: true,
                  javaScriptEnabled: true,
                  domStorageEnabled: true,
                  allowsInlineMediaPlayback: true,
                  mediaPlaybackRequiresUserAction: false,
                  onLoadStart: () => {
                    console.log('WebView LoadStart');
                    if (!playerReady) {
                      setIsLoading(true);
                    }
                  },
                  onLoad: handleWebViewLoad,
                  onError: (syntheticEvent) => {
                    console.log('WebView Error:', syntheticEvent.nativeEvent);
                    setIsError(true);
                    setIsLoading(false);
                  },
                }}
              />
            </View>

            {(isLoading || !playerReady) && (
              <View className="absolute inset-0 z-10 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
              </View>
            )}

            {isError && (
              <View className="absolute inset-0 z-10 items-center justify-center bg-black">
                <Text className="mb-4 text-center text-white">
                  동영상을 불러오는데 실패했습니다.
                </Text>
                <Pressable
                  onPress={() => {
                    setIsError(false);
                    setIsLoading(true);
                    setKey((prev) => prev + 1);
                  }}
                  className="mb-4 rounded-full bg-white px-6 py-2">
                  <Text className="font-medium">다시 시도</Text>
                </Pressable>
                <Pressable
                  onPress={() => videoId && handleExternalOpen(videoId)}
                  className="rounded-full bg-red-500 px-6 py-2">
                  <Text className="font-medium text-white">브라우저에서 열기</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
