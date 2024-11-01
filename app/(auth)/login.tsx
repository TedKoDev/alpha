import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '~/store/authStore';
import { Stack, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        await login(email, password);
      } catch (error: any) {
        console.log('Error details:', error);
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message;

        switch (statusCode) {
          case 404:
            alert('User not found. Please sign up first.');
            break;
          case 401:
            alert('Incorrect password. Please try again.');
            break;
          case 403:
            alert('Email verification required. Please check your email.');
            break;
          default:
            alert(errorMessage || 'Login failed. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter email and password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

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
            placeholderTextColor="#fff"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#fff"
          />

          <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>

          <Pressable style={styles.registerLink} onPress={() => router.push('/register')}>
            <Text style={styles.registerLinkText}>Don't have an account? Register</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  loginButton: {
    backgroundColor: 'rgba(178, 39, 212, 0.7)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 10,
  },
  registerLinkText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
