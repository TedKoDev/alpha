import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { useAuthStore } from '~/store/authStore';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  const { logout } = useAuthStore(); // 로그아웃 함수 가져오기

  const handleLogout = async () => {
    await logout(); // 로그아웃 실행
    Alert.alert('Logged out', 'You have been logged out successfully.'); // 로그아웃 알림
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My page' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/two.tsx" title="My paddingVertical" />

        {/* 로그아웃 버튼 */}
        <Button title="Logout" onPress={handleLogout} color="#FF0000" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
