import { useMutation } from '@tanstack/react-query';

import { updateUserProfileApi } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

interface UpdateUserProfileDto {
  userId: number;
  username: string;
  bio?: string;
  profile_picture_url?: string;
}

export const useUpdateProfile = () => {
  const token = useAuthStore((state) => state.userToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const currentUserInfo = useAuthStore((state) => state.userInfo);

  return useMutation({
    mutationFn: async (updateData: UpdateUserProfileDto) => {
      if (!token) throw new Error('No token available');

      const formattedData = {
        userId: Number(updateData.userId),
        username: updateData.username,
        bio: updateData.bio || '',
        profile_picture_url: updateData.profile_picture_url || '',
      };

      const response = await updateUserProfileApi(token, formattedData);

      setUserInfo({
        ...currentUserInfo,
        username: response.username,
        bio: response.bio,
        profile_picture_url: response.profile_picture_url,
        stats: currentUserInfo?.stats || {
          commentCount: 0,
          followersCount: 0,
          followingCount: 0,
          likedPostsCount: 0,
          postCount: 0,
        },
        country: currentUserInfo?.country || {
          country_code: 'GL',
          country_id: 1,
          country_name: 'Global',
          flag_icon: '🌎',
        },
      });

      return response;
    },
    onError: (error: any) => {
      console.error('Mutation error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });
      throw error;
    },
  });
};
