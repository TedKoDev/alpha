import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format } from 'date-fns';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import GrayLine from '../grayline';

import AngleRightIcon from '~/assets/icons/AnglerightIcon';
import { useLogs } from '~/queries/hooks/logs/useLogs';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useWords } from '~/queries/hooks/word/useWords';
import { useAuthStore } from '~/store/authStore';

interface PostContent {
  content: string;
}

// interface PostsResponse {
//   data: Post[];
//   limit: number;
//   page: number;
//   total: number;
// }

interface Post {
  comments: any;
  likes: any;
  post_content: PostContent;
  post_id: number;
  username: string;
}

export default function LessonCard({ onMorePress, participationCount = 0, points = 0 }: any) {
  const { userInfo } = useAuthStore(); // userInfo 가져오

  const { data: todayWords, isLoading } = useWords();
  // TODAY_TASK_PARTICIPATION 사용 시
  const { data: participationLogs } = useLogs({ type: 'TODAY_TASK_PARTICIPATION' });

  const {
    data: posts,
    isLoading: postsLoading,
  }: {
    data: any;
    isLoading: any;
    error: any;
  } = usePosts({
    page: 1,
    limit: 5,
    sort: 'latest',
    type: 'SENTENCE',
  });

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
        {/* 불꽃 아이콘 삽입 */}
        {/* <FlameIcon width={40} height={40} />
         */}

        {/* 프로필 이미지 삽입 */}
        {userInfo?.profile_picture_url ? (
          <Image
            source={{ uri: userInfo.profile_picture_url }}
            style={{ width: 50, height: 50, borderRadius: 25 }} // 원형 이미지
          />
        ) : (
          <FontAwesome name="user-circle" size={50} color="#B227D4" /> // FontAwesome 기본 아바타
        )}

        {/* 참여 횟수, 내가 쓴 문장 보러가기, 보유 포인트 */}
        <View className="ml-4 flex-1 flex-row  justify-between ">
          <View className="mr-5">
            <Text className="text-base font-bold text-gray-800">
              참여 횟수: {userInfo?.today_task_count}회
            </Text>
            <TouchableOpacity onPress={onMorePress} className="flex-row items-center">
              <Text className="text-sm text-[#B227D4]">See my works</Text>
              <View className="ml-2 mt-0.5">
                <AngleRightIcon width={10} height={10} color="#B227D4" />
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex bg-white">
            <Text className="text-lg text-black  ">Points : {userInfo?.points} P</Text>
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
          <Text className="text-sm text-white">Joined: {participationLogs.count} Users</Text>
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
            posts?.data?.map((post: Post, index: number) => (
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
          <TouchableOpacity>
            <Text className="text-center font-bold text-[#B227D4]">더보기 . . .</Text>
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
