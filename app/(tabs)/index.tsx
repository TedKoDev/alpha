import { router, Stack } from 'expo-router';
import { View, Image } from 'react-native';
import React from 'react';
import CustomCarousel from '~/components/customCarousel';
import maincarousel from 'assets/dummy/maincarousel.json';
import MainMenu from '~/components/maincategory/mainmenu';
import LessonCard from '~/components/todayvoca/lessoncard';
import GrayLine from '~/components/grayline';

export default function Events() {
  return (
    <View className="bg-white">
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
    </View>
  );
}
