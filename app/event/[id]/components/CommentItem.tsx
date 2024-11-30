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
    isSelected: boolean;
  };
  post_type?: string;
  isQuestionAuthor: boolean;
  onToggleLike: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newContent: string) => void;
  onSelectAnswer?: (commentId: number) => void;
  sortedComments?: any[];
}

export default function CommentItem({
  comment,
  onToggleLike,
  onDelete,
  onEdit,
  onSelectAnswer,
  post_type,
  isQuestionAuthor,
  sortedComments,
}: CommentItemProps) {
  console.log('isQuestionAuthorestionAuthor', isQuestionAuthor);
  console.log('comment.user_id', comment.user_id);

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
                <Text className="ml-2 text-xs text-gray-500">
                  {comment.user?.country?.flag_icon}
                </Text>
                <Text className="ml-1 text-xs text-red-500">Lv {comment.user?.level}</Text>
                <Text className="ml-2 text-xs text-gray-500">
                  {dayjs(comment.created_at).fromNow()}
                  {comment.content}
                </Text>
                <Text>{comment.comment_id}</Text>
              </View>

              <View className="mt-2 flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() => onToggleLike(comment.comment_id)}
                  className="flex-row items-center"
                  style={{ zIndex: 10, pointerEvents: 'auto' }}>
                  <FontAwesome
                    name={comment.user_liked ? 'heart' : 'heart-o'}
                    size={20}
                    color={comment.user_liked ? '#FF0000' : '#666666'}
                  />
                  <Text className="ml-1 text-gray-600">{comment.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOpenMenu}
                  style={{ zIndex: 10, pointerEvents: 'auto' }}>
                  <Feather name="more-horizontal" size={20} color="#666666" />
                </TouchableOpacity>
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
            {post_type === 'QUESTION' &&
              isQuestionAuthor &&
              !comment.isSelected &&
              comment.user_id !== currentUser?.user_id &&
              !sortedComments?.some((c) => c.isSelected) && (
                <TouchableOpacity
                  onPress={() => onSelectAnswer?.(comment.comment_id)}
                  className="mt-2 self-end rounded-lg bg-purple-500 px-3 py-1">
                  <Text className="text-white">답변 채택하기</Text>
                </TouchableOpacity>
              )}
            {comment.isSelected && (
              <View className="mt-2 self-end rounded-lg bg-green-100 px-3 py-1">
                <Text className="text-green-600">채택된 답변</Text>
              </View>
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
