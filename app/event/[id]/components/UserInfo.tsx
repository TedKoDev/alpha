import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, Image, Alert, Animated, Modal, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

import { useDeletePost } from '~/queries/hooks/posts/usePosts';
import { useAuthStore } from '~/store/authStore';

interface UserInfoProps {
  post_id: number;
  username: string;
  createdAt: string;
  user_level?: number;
  flag_icon?: string;
  user_profile_picture_url?: string | null;
  user_id: number;
  onDelete?: () => Promise<void>;
}

export default function UserInfo({
  post_id,
  username,
  createdAt,
  user_level = 1,
  flag_icon,
  user_profile_picture_url,
  user_id,
  onDelete,
}: UserInfoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const currentUser = useAuthStore((state) => state.userInfo);
  const isMyPost = currentUser?.user_id === user_id;
  const deletePost = useDeletePost();

  const handleOpenMenu = useCallback(() => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleCloseMenu = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  }, [fadeAnim, slideAnim]);

  const handleEdit = useCallback(() => {
    handleCloseMenu();
    router.push(`/event/edit/${post_id}`);
  }, [post_id, handleCloseMenu]);

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
              await deletePost.mutateAsync(post_id);
              router.back();
            } catch (error) {
              console.error('Failed to delete post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ],
      { cancelable: true }
    );
    handleCloseMenu();
  }, [post_id, deletePost]);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Text className="ml-2 text-sm text-orange-400">{flag_icon}</Text>
            <Text className="ml-2 text-sm text-orange-400">Level {user_level}</Text>
          </View>
          <Text className="text-sm text-gray-500">{createdAt}</Text>
        </View>
        <Pressable onPress={handleOpenMenu}>
          <Feather name="more-horizontal" size={24} color="#666666" />
        </Pressable>
      </View>

      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseMenu}
        statusBarTranslucent>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseMenu}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              transform: [{ translateY: slideAnim }],
            }}>
            <View className="mb-2 w-full items-center">
              <View className="h-1 w-10 rounded-full bg-gray-300" />
            </View>
            {isMyPost ? (
              <>
                <TouchableOpacity onPress={handleEdit}>
                  <View className="flex-row items-center py-4">
                    <Feather name="edit-2" size={20} color="#666666" />
                    <Text className="ml-3 text-base">Edit Post</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <View className="flex-row items-center py-4">
                    <Feather name="trash-2" size={20} color="#FF0000" />
                    <Text className="ml-3 text-base text-red-500">Delete Post</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleReport} className="flex-row items-center py-4">
                <Feather name="flag" size={20} color="#666666" />
                <Text className="ml-3 text-base">Report Post</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
  );
}
