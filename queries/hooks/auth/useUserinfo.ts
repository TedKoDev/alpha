import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import React from 'react';

import { getUserInfoApi } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

interface UserInfo {
  points: number;
  // ... 다른 필요한 사용자 정보 필드들
}

export function useUserInfo() {
  const token = useAuthStore((state) => state.userToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const response = await getUserInfoApi(token);
          setUserInfo(response);
          queryClient.setQueryData(['userInfo'], response);
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [token]);

  return useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      if (!token) throw new Error('No token available');
      const response = await getUserInfoApi(token);
      setUserInfo(response);
      return response;
    },
    enabled: !!token,
    staleTime: 0,
  });
}

// useRefreshUserInfo도 수정
export const useRefreshUserInfo = () => {
  const queryClient = useQueryClient();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return async () => {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) throw new Error('No token available');

      const response = await getUserInfoApi(token);
      //console.log('API Response:', response); // 디버깅용

      if (!response) {
        throw new Error('No data received from API');
      }

      // response.data 대신 response 직접 사용
      const newUserInfo = response;

      // Store 업데이트 전 로깅
      //console.log('Updating store with:', newUserInfo);

      setUserInfo(newUserInfo);
      queryClient.setQueryData(['userInfo'], newUserInfo);

      // Store 업데이트 후 확인
      //console.log('Updated store:', useAuthStore.getState().userInfo);

      return newUserInfo;
    } catch (error) {
      console.error('Failed to refresh user info:', error);
      throw error;
    }
  };
};
