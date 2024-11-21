import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View, Image, Pressable, ScrollView } from 'react-native';

import CommentSection from './components/CommentSection';
import UserInfo from './components/UserInfo';

import { useGetPostById } from '~/queries/hooks/posts/usePosts';

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const { data: post, isLoading } = useGetPostById(Number(id));

  //console.log('post', post);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: '상세보기',
          headerBackTitleVisible: false,
          headerTintColor: 'black',
        }}
      />

      <ScrollView className="flex-1">
        <UserInfo
          username={post.username}
          createdAt={dayjs(post.created_at).format('YYYY.MM.DD HH:mm')}
          user_level={post.user_level}
          user_profile_picture_url={post.user_profile_picture_url}
        />

        {/* Main Content */}
        <View className="p-4">
          {post.post_content.title && (
            <Text className="mb-2 text-lg font-bold">{post.post_content.title}</Text>
          )}

          {post.media && post.media.length > 0 && (
            <Image source={{ uri: post.media[0] }} className="mb-4 h-72 w-full rounded-lg" />
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
  );
}
