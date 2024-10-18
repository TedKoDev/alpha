import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator, Animated, Image } from 'react-native';
import '../global.css';

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const [logoAnim] = useState(new Animated.Value(0)); // 로고 애니메이션 초기 크기
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth(); // 인증 상태 확인
      setLoading(false); // 인증 상태 확인 후 로딩 종료
    };

    checkAuthentication();

    // 로고 애니메이션 설정
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // 인증되지 않았을 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      console.log('Not authenticated');
      router.replace('/login'); // /auth/login이 아니라 /login으로
    }
  }, [isAuthenticated, loading]);

  if (loading || isAuthenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        {/* 로고 애니메이션 */}
        <Animated.Image
          source={require('../assets/icon.png')} // 로고 이미지
          style={{ width: 150, height: 150, transform: [{ scale: logoAnim }] }}
        />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="voca"
        options={{ headerTitle: 'Voca Section', headerShown: false }} // 이름을 'Voca Section'으로 변경
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
