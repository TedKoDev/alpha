import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { checkEmail, loginApi, registerApi } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  userInfo?: any;
  userToken?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userToken: undefined,

  register: async (name: string, email: string, password: string) => {
    const response = await registerApi(name, email, password);
    console.log('register response', response);
  },

  login: async (email: string, password: string) => {
    const data = await loginApi(email, password);
    console.log('login token', data.access_token);
    console.log('userinfo', data.user);
    if (data) {
      await AsyncStorage.setItem('userToken', data.access_token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      set({
        isAuthenticated: true,
        userInfo: data.user,
        userToken: data.access_token,
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    set({ isAuthenticated: false, userInfo: undefined, userToken: undefined });
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    set({
      isAuthenticated: !!token,
      userInfo: userInfo ? JSON.parse(userInfo) : undefined,
      userToken: token || undefined,
    });
  },
}));
