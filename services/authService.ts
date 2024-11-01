import { api } from './api';

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login success', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const registerApi = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    console.log('Register success', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register failed', error);
    if (error.response?.status === 409) {
      throw new Error(
        'This email is already registered. Please try with a different email address or log in if you already have an account.'
      );
    }
    throw new Error(
      'Registration failed. Please check your information and try again. If the problem persists, please contact our support team.'
    );
  }
};

export const checkEmail = async (email: string): Promise<boolean> => {
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkName = async (name: string): Promise<boolean> => {
  // 이름 길이 검증 (2글자 이상)
  return name.length >= 2;
};

export const authService = {
  checkEmail,
  checkName,
  loginApi,
  registerApi,
};
