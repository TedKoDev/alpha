import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, ScrollView, RefreshControl } from 'react-native';

import maincarousel from '~/assets/dummy/maincarousel.json';
import CustomCarousel from '~/components/customCarousel';
import GrayLine from '~/components/grayline';
import MainMenu from '~/components/maincategory/mainmenu';
import LessonCard from '~/components/todayvoca/lessoncard';
import { useRefreshUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useAuthStore } from '~/store/authStore';

export default function Home() {
  const queryClient = useQueryClient();
  const refreshUserInfo = useRefreshUserInfo();

  const { data, isRefetching, refetch } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const response = await fetch('/api/lessons');
      return response.json();
    },
  });

  const onRefresh = async () => {
    await Promise.all([
      refetch(),
      refreshUserInfo(),
      queryClient.invalidateQueries({ queryKey: ['words'] }),
      queryClient.invalidateQueries({ queryKey: ['logs'] }),
      queryClient.invalidateQueries({ queryKey: ['posts'] }),
    ]);
  };

  return (
    <ScrollView
      className="bg-white"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}>
      {/* 전체 화면을 차지 */}
      {/* 스택 타이틀 설정 */}
      <Stack.Screen
        options={{
          headerTitle: '',
          title: 'HOME',
        }}
      />
      {/* 캐러셀 삽입 */}
      <View>
        {/* 여기에 패딩을 적용 */}
        <CustomCarousel items={maincarousel} />
      </View>
      <View className="flex-row justify-around">
        <MainMenu />
      </View>
      <View className="">
        <GrayLine thickness={5} marginTop={10} />
      </View>
      <LessonCard
        onMorePress={() => router.push('/write/with-words')}
        participationCount={10}
        points={500}
      />
    </ScrollView>
  );
}
