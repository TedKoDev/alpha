import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, Pressable, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommentSection from './components/CommentSection';
import UserInfo from './components/UserInfo';

import { useGetPostById } from '~/queries/hooks/posts/usePosts';

const { width } = Dimensions.get('window');

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const { data: post, isLoading } = useGetPostById(Number(id));
  const [activeIndex, setActiveIndex] = useState(0);

  console.log('post', JSON.stringify(post, null, 2));

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="flex-1 bg-white">
          <Stack.Screen
            options={{
              headerTitle: '상세보기',
              headerBackTitle: '',
              headerBackVisible: true,
              headerTintColor: '#D812DC',
              headerStyle: {
                backgroundColor: 'white',
              },
            }}
          />

          <ScrollView className="flex-1">
            <UserInfo
              post_id={post.post_id}
              user_id={post.user_id}
              username={post.username}
              createdAt={dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}
              user_level={post.user_level}
              user_profile_picture_url={post.user_profile_picture_url}
              onDelete={async () => {
                // 삭제 로직 구현
                try {
                  // deletePost mutation 호출
                  await deletePostMutation.mutateAsync(post.post_id);
                  // 성공 시 처리
                } catch (error) {
                  console.error('Failed to delete post:', error);
                  Alert.alert('Error', 'Failed to delete post');
                }
              }}
            />

            {/* Main Content */}
            <View className="p-4">
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
                <View className="flex-row items-center">
                  <Feather name="heart" size={16} color="#666666" />
                  <Text className="ml-1 text-sm text-gray-500">{post.likes}</Text>
                </View>
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
              <CommentSection comments={post.comments} />
            </View>
          </ScrollView>

          {/* Comment Input */}
          <View className="mb-3 border-t border-gray-200 px-4 py-5">
            <Pressable className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
              <Text className="text-gray-500">댓글을 입력하세요...</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
