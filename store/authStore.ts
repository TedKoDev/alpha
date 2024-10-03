import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../services/authService'; // 서비스로부터 가져옴

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const token = await loginApi(email, password); // 로그인 API 호출
    console.log('login token', token);
    if (token) {
      await AsyncStorage.setItem('userToken', token);
      set({ isAuthenticated: true });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    set({ isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('userToken');
    set({ isAuthenticated: !!token });
  },
}));
