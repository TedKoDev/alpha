import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { getUserInfoApi, loginApi, registerApi } from '../services/authService';

interface UserInfo {
  account_status: string;
  bio: string;
  country: {
    country_code: string;
    country_id: number;
    country_name: string;
    flag_icon: string;
  };
  created_at: string;
  email: string;
  last_login_at: string;
  level: number;
  points: number;
  profile_picture_url: string;
  role: string;
  stats: {
    commentCount: number;
    followersCount: number;
    followingCount: number;
    likedPostsCount: number;
    postCount: number;
  };
  today_task_count: number;
  user_id: number;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userInfo?: UserInfo;
  userToken?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, country_id: number) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUserInfo: (info: any) => void;
  updateUserInfo: (newData: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: undefined,
  userToken: undefined,

  register: async (name: string, email: string, password: string, country_id: number) => {
    const response = await registerApi(name, email, password, country_id);
    console.log('register response', response);
  },

  login: async (email: string, password: string) => {
    const data = await loginApi(email, password);
    if (data) {
      await AsyncStorage.setItem('userToken', data.access_token);

      const userInfo = await getUserInfoApi(data.access_token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      set({
        isAuthenticated: true,
        userInfo: userInfo,
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
    set({ userInfo: info });
  },

  updateUserInfo: (newData) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            today_task_count: newData.today_task_count,
            points: newData.points,
            stats: {
              ...state.userInfo.stats,
              ...newData._count,
            },
          }
        : undefined,
    })),
}));
