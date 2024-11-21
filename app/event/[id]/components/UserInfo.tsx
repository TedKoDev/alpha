import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal } from 'react-native';

import { useAuthStore } from '~/store/authStore';

interface UserInfoProps {
  post_id: number;
  username: string;
  createdAt: string;
  user_level?: number;
  user_profile_picture_url?: string | null;
  user_id: number; // 게시글 작성자의 ID
  onDelete?: () => Promise<void>; // 삭제 핸들러
}

export default function UserInfo({
  post_id,
  username,
  createdAt,
  user_level = 1,
  user_profile_picture_url,
  user_id,
  onDelete,
}: UserInfoProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.userInfo);
  const isMyPost = currentUser?.user_id === user_id;

  const handleOpenMenu = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleEdit = useCallback(() => {
    handleCloseMenu();
    router.push(`/edit/${post_id}`);
  }, [post_id]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (onDelete) {
                await onDelete();
                router.back();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ],
      { cancelable: true }
    );
    handleCloseMenu();
  }, [onDelete]);

  const handleReport = useCallback(() => {
    Alert.alert(
      'Report Post',
      'Are you sure you want to report this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: () => {
            Alert.alert('Success', 'Post has been reported');
          },
        },
      ],
      { cancelable: true }
    );
    handleCloseMenu();
  }, []);

  return (
    <>
      <View className="flex-row items-center border-b border-gray-200 p-4">
        <Image
          source={{
            uri: user_profile_picture_url || 'https://via.placeholder.com/100',
          }}
          className="h-10 w-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold">{username}</Text>
            <Text className="ml-2 text-sm text-orange-400">Level {user_level}</Text>
          </View>
          <Text className="text-sm text-gray-500">{createdAt}</Text>
        </View>
        <TouchableOpacity onPress={handleOpenMenu}>
          <Feather name="more-horizontal" size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={handleCloseMenu}>
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={handleCloseMenu}>
          <View className="flex-1 justify-end">
            <View
              className="w-full rounded-t-3xl bg-white"
              style={{
                height: isMyPost ? 160 : 100,
              }}>
              <View className="mx-auto mt-3 h-1 w-12 rounded-full bg-gray-300" />
              <View className="p-4">
                {isMyPost ? (
                  <>
                    <TouchableOpacity
                      onPress={handleEdit}
                      className="flex-row items-center border-b border-gray-200 py-4">
                      <Feather name="edit-2" size={20} color="#666666" />
                      <Text className="ml-3 text-base">Edit Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} className="flex-row items-center py-4">
                      <Feather name="trash-2" size={20} color="#FF0000" />
                      <Text className="ml-3 text-base text-red-500">Delete Post</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={handleReport} className="flex-row items-center py-4">
                    <Feather name="flag" size={20} color="#666666" />
                    <Text className="ml-3 text-base">Report Post</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCloseMenu}>
        <View className="pointer-events-none flex-1">
          <View
            className="absolute bottom-0 w-full rounded-t-3xl bg-white"
            style={{
              height: isMyPost ? 160 : 100,
            }}>
            <View className="mx-auto mt-3 h-1 w-12 rounded-full bg-gray-300" />
            <View className="p-4">
              {isMyPost ? (
                <>
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-row items-center border-b border-gray-200 py-4">
                    <Feather name="edit-2" size={20} color="#666666" />
                    <Text className="ml-3 text-base">Edit Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete} className="flex-row items-center py-4">
                    <Feather name="trash-2" size={20} color="#FF0000" />
                    <Text className="ml-3 text-base text-red-500">Delete Post</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={handleReport} className="flex-row items-center py-4">
                  <Feather name="flag" size={20} color="#666666" />
                  <Text className="ml-3 text-base">Report Post</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
