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
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  // videoId가 변경될 때마다 상태 초기화
  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setIsError(false);

      // 15초 후에도 로딩이 완료되지 않으면 에러 처리
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setIsError(true);
      }, 3000);

      setLoadingTimeout(timeout);
    }

    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [videoId]);

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

  const onError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
  }, [loadingTimeout]);

  const onReady = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
  }, [loadingTimeout]);

  const handleRetry = useCallback(() => {
    if (!videoId) return;
    setIsError(false);
    setIsLoading(true);

    // 재시도 시에도 타임아웃 설정
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsError(true);
    }, 5000);

    setLoadingTimeout(timeout);
  }, [videoId]);

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
            {isLoading && (
              <View className="absolute inset-0 z-10 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
              </View>
            )}

            {isError ? (
              <View className="items-center justify-center p-4">
                <Text className="mb-4 text-center text-white">
                  동영상을 불러오는데 실패했습니다.
                </Text>
                <Pressable onPress={handleRetry} className="mb-4 rounded-full bg-white px-6 py-2">
                  <Text className="font-medium">다시 시도</Text>
                </Pressable>
                <Pressable
                  onPress={() => videoId && handleExternalOpen(videoId)}
                  className="rounded-full bg-red-500 px-6 py-2">
                  <Text className="font-medium text-white">브라우저에서 열기</Text>
                </Pressable>
              </View>
            ) : (
              <YoutubePlayer
                height={300}
                play
                videoId={videoId}
                onReady={onReady}
                onError={onError}
                initialPlayerParams={{
                  preventFullScreen: false,
                  // cc_lang_pref: 'kr',
                  showClosedCaptions: false,
                  modestbranding: true,
                  rel: false,
                }}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
