import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '~/store/authStore';
import { Stack, useRouter } from 'expo-router'; // 추가
import { Video, ResizeMode } from 'expo-av';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuthStore(); // Zustand의 login, isAuthenticated 함수 사용
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    } else {
      alert('Please enter email and password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/'); // 인증되었을 경우 (tabs) 페이지로 이동
    }
  }, [isAuthenticated]); // 로그인 상태 변경 시 감시

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Video
          source={require('../../assets/background.mp4')}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // 투명한 흰색 배경
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'rgba(178, 39, 212, 0.7)', // 투명한 보라색 배경
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
