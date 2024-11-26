import { Feather, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Animated,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

import EditCommentModal from './EditCommentModal';

import { useAuthStore } from '~/store/authStore';

dayjs.extend(relativeTime);

interface CommentItemProps {
  comment: {
    comment_id: number;
    user: {
      username: string;
      profile_picture_url?: string;
    };
    created_at: string;
    content: string;
    user_liked: boolean;
    likes: number;
    user_id: number;
  };
  onToggleLike: (commentId: number) => void; // 댓글 좋아요 토글 함수
  onDelete: (commentId: number) => void; // 댓글 삭제 함수
  onEdit: (commentId: number, newContent: string) => void; // 댓글 수정 함수
}

export default function CommentItem({ comment, onToggleLike, onDelete, onEdit }: CommentItemProps) {
  console.log('comment ', comment);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const currentUser = useAuthStore((state) => state.userInfo);
  const isMyComment = currentUser?.user_id === comment.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

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
    setIsEditing(true);
  }, []);

  const handleSubmitEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.comment_id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = useCallback(() => {
    console.log('handleDelete');
    handleCloseMenu();
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(comment.comment_id),
        },
      ],
      { cancelable: true }
    );
  }, [comment.comment_id, onDelete]);

  const handleReport = useCallback(() => {
    handleCloseMenu();
    Alert.alert(
      'Report Comment',
      'Are you sure you want to report this comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: () => {
            Alert.alert('Success', 'Comment has been reported');
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="mb-4 border-b border-gray-200 pb-2">
        <View className="flex-row items-start">
          <Image
            source={{
              uri: comment.user?.profile_picture_url || 'https://via.placeholder.com/32',
            }}
            className="h-8 w-8 rounded-full"
          />
          <View className="ml-2 flex-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="font-bold">{comment.user?.username}</Text>
                {/* 유저 지역 표시 */}
                <Text className="ml-2 text-xs text-gray-500">
                  {comment.user?.country?.flag_icon}
                </Text>
                <Text className="ml-1 text-xs text-red-500">Lv {comment.user?.level}</Text>

                <Text className="ml-2 text-xs text-gray-500">
                  {dayjs(comment.created_at).fromNow()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Pressable onPress={() => onToggleLike(comment.comment_id)}>
                  <FontAwesome
                    name={comment.user_liked ? 'heart' : 'heart-o'}
                    size={16}
                    color={comment.user_liked ? 'red' : '#666666'}
                  />
                </Pressable>
                <Pressable onPress={handleOpenMenu} style={{ marginLeft: 10 }}>
                  <Feather name="more-horizontal" size={20} color="#666666" />
                </Pressable>
              </View>
            </View>
            {isEditing ? (
              <View className="mt-1">
                <TextInput
                  className="rounded-lg border border-purple-200 bg-white p-2 text-base text-gray-800"
                  multiline
                  value={editContent}
                  onChangeText={setEditContent}
                  autoFocus
                />
                <View className="mt-2 flex-row justify-end space-x-2">
                  <Pressable
                    onPress={handleCancelEdit}
                    style={{
                      backgroundColor: '#f3f4f6',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}>
                    <Text className="text-gray-600">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmitEdit}
                    style={{
                      backgroundColor: '#4b5563',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}>
                    <Text className="text-white">Save</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text className="mt-1 text-gray-800">{comment.content}</Text>
            )}
          </View>
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
              {isMyComment ? (
                <>
                  <TouchableOpacity onPress={handleEdit}>
                    <View className="flex-row items-center py-4">
                      <Feather name="edit-2" size={20} color="#666666" />
                      <Text className="ml-3 text-base">Edit Comment</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <View className="flex-row items-center py-4">
                      <Feather name="trash-2" size={20} color="#FF0000" />
                      <Text className="ml-3 text-base text-red-500">Delete Comment</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={handleReport} className="flex-row items-center py-4">
                  <Feather name="flag" size={20} color="#666666" />
                  <Text className="ml-3 text-base">Report Comment</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}
