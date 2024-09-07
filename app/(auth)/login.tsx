import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '~/store/authStore';
import { Stack } from 'expo-router';
import { Video, ResizeMode } from 'expo-av'; // ResizeMode import 추가

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore(); // Zustand의 login 함수 사용

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <>
      {/* 헤더를 숨김 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 배경 동영상 */}
      <View style={styles.container}>
        <Video
          source={require('../../assets/background.mp4')} // 배경 동영상 경로
          rate={1.0}
          volume={1.0}
          isMuted={true}
          resizeMode={ResizeMode.COVER} // ResizeMode.COVER 사용
          shouldPlay
          isLooping
          style={StyleSheet.absoluteFill} // 전체 화면을 덮도록 설정
        />

        {/* 로그인 폼 */}
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

          <Pressable
            style={styles.googleButton}
            onPress={() => {
              console.log('Google login');
              /* Google 로그인 로직 */
            }}>
            <Text style={styles.googleButtonText}>Login with Google</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 반투명 배경
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
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
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
  googleButton: {
    backgroundColor: '#DB4437',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
