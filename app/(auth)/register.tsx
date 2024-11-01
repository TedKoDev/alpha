import { Stack, useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

import { authService } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  // const [setIsCheckingName] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const { register } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const checkName = debounce(async (name: string) => {
    if (!name) {
      setNameError('');
      setIsNameValid(false);
      return;
    }
    // setIsCheckingName(true);
    try {
      const available = await authService.checkName(name);
      setIsNameValid(available);
      setNameError(available ? '' : 'This name is already taken. Please choose a different name.');
    } catch (error) {
      console.error('Name check failed:', error);
      setNameError('Failed to check name availability. Please try again.');
    } finally {
      // setIsCheckingName(false);
    }
  }, 500);

  const checkEmail = async (email: string) => {
    if (!email) {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }
    setIsCheckingEmail(true);
    try {
      const available = await authService.checkEmail(email);
      setIsEmailValid(available);
      setEmailError(
        available ? '' : 'This email is already registered. Please use a different email address.'
      );
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailError('Failed to check email availability. Please try again.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;

    if (!isEmailValid || !isNameValid) {
      alert('Please make sure both email and name are available.');
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
      alert('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Registration failed: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="NickName"
              value={name}
              onChangeText={(text) => {
                setName(text);
                checkName(text);
              }}
            />

            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : isNameValid && name ? (
              <Text style={styles.successText}>This name is available!</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.emailContainer}>
              <TextInput
                style={[styles.input, styles.emailInput, emailError ? styles.inputError : null]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pressable
                style={[styles.checkButton, isCheckingEmail && styles.checkingButton]}
                onPress={() => checkEmail(email)}
                disabled={isCheckingEmail}>
                <Text style={styles.checkButtonText}>
                  {isCheckingEmail ? 'Checking...' : 'Check'}
                </Text>
              </Pressable>
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : isEmailValid && email ? (
              <Text style={styles.successText}>This email is available!</Text>
            ) : null}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}>
            <Text style={styles.registerButtonText}>{isLoading ? '등록 중...' : 'Sign Up'}</Text>
          </Pressable>

          <Pressable onPress={() => router.back()}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // 깔끔한 흰색 배경으로 변경
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#333', // 부드러운 검정색으로 변경
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff', // 더 깔끔한 흰색 배경
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd', // 더 부드러운 테두리 색상
  },
  inputContainer: {
    width: '100%',
  },
  registerButton: {
    backgroundColor: 'rgba(178, 39, 212, 1)', // 좀 더 명확한 파란색으로 변경
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    color: '#5568FE',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 15,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  checkButton: {
    backgroundColor: 'rgba(178, 39, 212, 1)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  checkingButton: {
    opacity: 0.7,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  checkingText: {
    color: '#888', // 부드러운 회색으로 변경
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  successText: {
    color: '#388E3C',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#D32F2F', // 에러 상태일 때 빨간색 테두리
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
