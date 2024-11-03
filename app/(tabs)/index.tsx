import maincarousel from '~/assets/dummy/maincarousel.json';
import { router, Stack } from 'expo-router';
import { View, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import CustomCarousel from '~/components/customCarousel';
import MainMenu from '~/components/maincategory/mainmenu';
import LessonCard from '~/components/todayvoca/lessoncard';
import GrayLine from '~/components/grayline';
import { useAuthStore } from '~/store/authStore';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      // API 호출 예시
      const response = await fetch('/api/lessons');
      return response.json();
    },
  });

  return (
    <ScrollView
      className="bg-white"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
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
        onMorePress={() => router.push('/(tabs)/feed')}
        participationCount={10}
        points={500}
      />
    </ScrollView>
  );
}
