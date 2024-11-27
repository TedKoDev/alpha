import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';

import maincarousel from '~/assets/dummy/maincarousel.json';
import BoardTabs from '~/components/board/BoardTabs';
import BelaPick from '~/components/board/belapick';
import CustomCarousel from '~/components/customCarousel';
import GrayLine from '~/components/grayline';
import MenuCards from '~/components/home/MenuCards';
import YoutubeSection from '~/components/home/YoutubeSection';
import MainMenu from '~/components/maincategory/mainmenu';
import LessonCard from '~/components/todayvoca/lessoncard';
import { useRefreshUserInfo } from '~/queries/hooks/auth/useUserinfo';

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
      queryClient.invalidateQueries({ queryKey: ['todayWords'] }),
    ]);
  };

  return (
    <ScrollView
      className="bg-white"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}>
      <Stack.Screen
        options={{
          headerTitle: '',
          title: 'HOME',
        }}
      />
      <View>
        <CustomCarousel items={maincarousel} />
      </View>
      <View className="flex-row justify-around">
        <MainMenu />
      </View>
      <GrayLine thickness={5} marginTop={10} />
      <View className="-mb-4">
        <MenuCards />
      </View>

      <GrayLine thickness={5} marginTop={0} />
      <YoutubeSection />
      <GrayLine thickness={5} marginTop={0} />
      <LessonCard
        onMorePress={() => router.push('/write/with-words')}
        participationCount={10}
        points={500}
      />
      <View>
        <GrayLine thickness={5} marginTop={10} />
      </View>
      <BoardTabs />
      <View className="mb-10">
        <GrayLine thickness={5} marginTop={10} />
      </View>
    </ScrollView>
  );
}
