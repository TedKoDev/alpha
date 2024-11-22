import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Animated, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useSharedValue,
  withSpring,
  configureReanimatedLogger,
  ReanimatedLogLevel,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useAuthStore } from '../store/authStore';

import '../global.css';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const [loading, setLoading] = useState(true); // 로딩 상태

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1분
        gcTime: 1000 * 60 * 5, // 5분
      },
    },
  });

  // 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth(); // 인증 상태 확인
      setLoading(false); // 인증 상태 확인 후 로딩 종료
    };

    checkAuthentication();

    // 애니메이션 수정
    logoScale.value = withSpring(1, {
      duration: 1000,
    });
  }, []);

  // 인증되지 않았을 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      //console.log('Not authenticated');
      router.replace('/login'); // /auth/login이 아니라 /login으로
    }
  }, [isAuthenticated, loading]);

  if (loading || isAuthenticated === null) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <Animated.Image
            source={require('../assets/icon.png')}
            style={[{ width: 150, height: 150 }, animatedStyle]}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(stack)" options={{ headerShown: false }} />
            <Stack.Screen
              name="voca"
              options={{
                headerTitle: 'Voca Section',
                headerShown: false,
                headerTintColor: '#D812DC',
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
