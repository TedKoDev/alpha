import { Feather, FontAwesome } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useCallback, memo, useRef } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommentSection from './components/CommentSection';
import UserInfo from './components/UserInfo';

import { useGetPostById } from '~/queries/hooks/posts/usePosts';
import { useTogglePostLike } from '~/queries/hooks/useLikes';
import CommentInput from './components/CommentInput';

const { width } = Dimensions.get('window');

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const { data: post, isLoading } = useGetPostById(Number(id));
  const [activeIndex, setActiveIndex] = useState(0);
  const togglePostLikeMutation = useTogglePostLike();

  const handleScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (!post) return <Text>Post not found</Text>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}>
          <View className="flex-1 bg-white">
            <Stack.Screen
              options={{
                headerTitle: '상세보기',
                headerBackTitle: '',
                headerBackVisible: true,
                headerTintColor: '#D812DC',
                headerStyle: { backgroundColor: 'white' },
              }}
            />

            <ScrollView
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets={true}>
              <UserInfo
                post_id={post.post_id}
                user_id={post.user_id}
                username={post.username}
                createdAt={dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}
                user_level={post.user_level}
                user_profile_picture_url={post.user_profile_picture_url}
              />

              <View className="p-4">
                {/* Post Content */}
                {post.post_content.title && (
                  <Text className="mb-2 text-lg font-bold">{post.post_content.title}</Text>
                )}
                {post.media && post.media.length > 0 && (
                  <View>
                    <FlatList
                      data={post.media}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onScroll={handleScroll}
                      renderItem={({ item }) => (
                        <Image
                          source={{ uri: item.media_url }}
                          style={{ width, height: 300 }}
                          className="mb-4 rounded-lg"
                        />
                      )}
                      keyExtractor={(item) => item.media_id.toString()}
                    />
                    <View className="mt-2 flex-row justify-center">
                      {post.media.map((_: any, index: any) => (
                        <View
                          key={index}
                          className={`mx-1 h-2 w-2 rounded-full ${
                            index === activeIndex ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {post.post_content.content && (
                  <Text className="mb-4 text-base text-gray-800">{post.post_content.content}</Text>
                )}

                {/* Engagement Stats */}
                <View className="mt-2 flex-row items-center gap-4 border-b border-gray-200 pb-4">
                  <Pressable onPress={() => togglePostLikeMutation.mutate(post.post_id)}>
                    <View className="flex-row items-center">
                      <FontAwesome
                        name={post.user_liked ? 'heart' : 'heart-o'}
                        size={16}
                        color={post.user_liked ? 'red' : '#666666'}
                      />
                      <Text className="ml-1 text-sm text-gray-500">{post.likes}</Text>
                    </View>
                  </Pressable>
                  <View className="flex-row items-center">
                    <Feather name="message-square" size={16} color="#666666" />
                    <Text className="ml-1 text-sm text-gray-500">{post.comments?.length || 0}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="eye" size={16} color="#666666" />
                    <Text className="ml-1 text-sm text-gray-500">{post.views}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="bookmark" size={16} color="#666666" />
                    <Text className="ml-1 text-sm text-gray-500">저장하기</Text>
                  </View>
                </View>

                {/* Comments Section */}
                <CommentSection postId={post.post_id} comments={post.comments} />
                <View className="h-20" />
              </View>
            </ScrollView>

            <View className="mb-2 border-t border-gray-200">
              <CommentInput postId={post.post_id} />
              {Platform.OS === 'android' && <View className="h-14" />}
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
