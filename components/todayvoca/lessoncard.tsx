import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import GrayLine from '../grayline';

import AngleRightIcon from '~/assets/icons/AnglerightIcon';
import { useLogs } from '~/queries/hooks/logs/useLogs';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useWords } from '~/queries/hooks/word/useWords';
import { useAuthStore } from '~/store/authStore';

// interface PostContent {
//   content: string;
// }

// interface PostsResponse {
//   data: Post[];
//   limit: number;
//   page: number;
//   total: number;
// }

export default function LessonCard({ onMorePress, participationCount = 0, points = 0 }: any) {
  const userInfo = useAuthStore((state) => state.userInfo);
  const { data: todayWords, isLoading } = useWords();
  const { data: participationLogs } = useLogs({ type: 'TODAY_TASK_PARTICIPATION' });
  const { data: posts, isLoading: postsLoading } = usePosts({
    page: 1,
    limit: 5,
    sort: 'latest',
    type: 'SENTENCE',
  });

  console.log('posts', posts);
  console.log('participationLogs', participationLogs);

  //console.log('Current Auth Store:', useAuthStore.getState());
  //console.log('Current userInfo in LessonCard:', userInfo);

  // 사용자 데이터 구조 통일
  const userData = userInfo?.user || userInfo;
  //console.log('User data:', userData);

  const router = useRouter();

  if (postsLoading || isLoading) {
    return (
      <View className="items-center justify-center rounded-lg bg-white p-5" style={{ height: 300 }}>
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  if (!todayWords) {
    return (
      <View className="items-center justify-center rounded-lg bg-white p-5">
        <Text>오늘의 단어를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const getFormattedDate = () => {
    try {
      const seoulDate = new Date();
      return format(seoulDate, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const formattedDate = getFormattedDate();

  return (
    <View className="rounded-lg bg-white p-5">
      <View className="mb-4 flex-row items-center">
        {/* 프로필 이미지 삽입 */}
        {userData?.profile_picture_url ? (
          <Image
            source={{ uri: userData.profile_picture_url }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        ) : (
          <FontAwesome name="user-circle" size={50} color="#B227D4" />
        )}

        {/* 참여 횟수, 내가 쓴 문장 보러가기, 보유 포인트 */}
        <View className="ml-4 flex-1 flex-row justify-between">
          <View className="mr-5">
            <Text className="text-base font-bold text-gray-800">
              참여 횟수: {userData?.today_task_count || 0}회
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/mypage')}
              className="flex-row items-center">
              <Text className="text-sm text-[#B227D4]">See my works</Text>
              <View className="ml-2 mt-0.5">
                <AngleRightIcon width={10} height={10} color="#B227D4" />
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex bg-white">
            <Text className="text-lg text-black">Points : {userData?.points || 0} P</Text>
          </View>
        </View>
      </View>

      <View className="mb-4 rounded-lg bg-[#B227D4]/80 p-4">
        <View className="mb-3 flex-row justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-white">Today's Words</Text>
            </View>
            <Text className="text-sm text-white">{formattedDate}</Text>
          </View>
          <Text className="text-sm text-white">Joined: {participationLogs?.count} Users</Text>
        </View>
        {/* 한국어 단어 3가지를 가로로 배치 */}
        <View className="mb-4 flex-row space-x-4">
          {todayWords.map((wordData: any, index: number) => (
            <View
              key={index}
              className={`flex-1 items-center justify-center rounded-md bg-white/90 p-3 ${
                index !== todayWords.length - 1 ? 'mr-2' : 'mr-0'
              }`}>
              <Text className="text-lg font-bold text-[#B227D4]">{wordData.word}</Text>
            </View>
          ))}
        </View>

        {/* 최근 참여한 사람의 문장 */}
        <View className="mb-3 rounded-md bg-white/90 p-3">
          {postsLoading ? (
            <ActivityIndicator size="small" color="#B227D4" />
          ) : (
            posts?.pages[0]?.data?.map((post: any, index: number) => (
              <View key={index} className="mb-2 flex-row items-center justify-between">
                <Text className="flex-1 text-sm text-[#B227D4]">{post.post_content.content}</Text>
                <View className="ml-2 flex-row gap-3">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome name="heart" size={12} color="#666666" />
                    <Text className="text-xs text-gray-500">{post.likes}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <FontAwesome name="comment" size={12} color="#666666" />
                    <Text className="text-xs text-gray-500">{post.comments.length}</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          <GrayLine thickness={1} marginTop={5} marginBottom={5} />
          <TouchableOpacity onPress={() => router.push('/(stack)/feedlist')}>
            <Text className="text-center font-bold text-[#B227D4]">See More . . .</Text>
          </TouchableOpacity>
        </View>

        {/* 참여하기 버튼 */}
        <TouchableOpacity
          className="items-center justify-center rounded-md bg-white py-3"
          onPress={onMorePress}>
          <Text className="text-lg font-bold text-[#B227D4]">참여하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
