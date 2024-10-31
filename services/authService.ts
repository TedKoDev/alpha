import { api } from './api';

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/keojak-dev-login', { email, password });

    console.log('Login success', response.data);
    return response.data.access_token; // 로그인 후 토큰 반환
  } catch (error) {
    console.error('Login failed', error);
    throw new Error('Login failed');
  }
};

export const registerApi = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    console.log('Register success', response.data);
    return response.data;
  } catch (error) {
    console.error('Register failed', error);
    throw new Error('Register failed');
  }
};
