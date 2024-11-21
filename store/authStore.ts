import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { checkEmail, getUserInfoApi, loginApi, registerApi } from '../services/authService';

import { api } from '~/services/api';

interface AuthState {
  isAuthenticated: boolean;
  userInfo?: any;
  userToken?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUserInfo: (info: any) => void;
  updateUserInfo: (newData: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: undefined,
  userToken: undefined,

  register: async (name: string, email: string, password: string) => {
    const response = await registerApi(name, email, password);
    //console.log('register response', response);
  },

  login: async (email: string, password: string) => {
    const data = await loginApi(email, password);
    //console.log('login token', data.access_token);
    //console.log('userinfo1243', data.user);
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

    set({
      isAuthenticated: !!token,
      userToken: token || undefined,
    });

    if (token) {
      try {
        const userInfo = await getUserInfoApi(token);
        set({ userInfo });
      } catch (error) {
        console.error('Failed to fetch user info during checkAuth:', error);
      }
    }
  },

  setUserInfo: (info) => {
    //console.log('Setting new userInfo:', info);
    set({ userInfo: info });
  },

  updateUserInfo: (newData) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        today_task_count: newData.today_task_count,
        points: newData.points,
        _count: newData._count || state.userInfo?._count,
      },
    })),
}));
