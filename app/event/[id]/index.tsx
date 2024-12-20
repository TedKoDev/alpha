import { Feather, FontAwesome } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Pressable, GestureHandlerRootView } from 'react-native-gesture-handler';

import CommentInput from './components/CommentInput';
import CommentSection from './components/CommentSection';
import UserInfo from './components/UserInfo';

import { useGetPostById } from '~/queries/hooks/posts/usePosts';
import { useTogglePostLike } from '~/queries/hooks/useLikes';

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

  console.log('post', JSON.stringify(post, null, 2));
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
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
              automaticallyAdjustKeyboardInsets>
              <UserInfo
                post_id={post.post_id}
                user_id={post.user_id}
                username={post.username}
                createdAt={dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}
                user_level={post.user_level}
                flag_icon={post.country_flag_icon}
                user_profile_picture_url={post.user_profile_picture_url}
              />

              <View className="py-2">
                {/* Post Content */}
                {post.post_content.title && (
                  <Text className="mb-2 px-2 text-lg font-bold">{post.post_content.title}</Text>
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
                          contentFit="cover"
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
                  <Text className="mb-4 px-2 text-base text-gray-800">
                    {post.post_content.content}
                  </Text>
                )}

                {/* Engagement Stats */}
                <View className="mt-2 flex-row items-center gap-4 border-b border-gray-200 px-4 pb-4">
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
                    <Text className="ml-1 text-sm text-gray-500">{post.comment_count || 0}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Feather name="eye" size={16} color="#666666" />
                    <Text className="ml-1 text-sm text-gray-500">{post.views}</Text>
                  </View>
                </View>

                {/* Comments Section */}
                <View className="px-4">
                  <CommentSection
                    postId={post.post_id}
                    postType={post.type}
                    post_user_id={post.user_id}
                  />
                </View>
                {/* <View className="h-20" /> */}
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
