import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserProfileApi } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

interface UpdateUserProfileDto {
  userId: number;
  username: string;
  bio?: string;
  profilePictureUrl?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.userToken);

  return useMutation({
    mutationFn: async (updateData: UpdateUserProfileDto) => {
      if (!token) throw new Error('No token available');

      const formattedData = {
        userId: Number(updateData.userId),
        username: updateData.username,
        bio: updateData.bio || '',
        profilePictureUrl: updateData.profilePictureUrl || '',
      };

      console.log('Sending formatted data:', formattedData);
      return updateUserProfileApi(token, formattedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
      useAuthStore.getState().setUserInfo(data);
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
