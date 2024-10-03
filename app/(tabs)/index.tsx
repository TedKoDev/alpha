import { Stack } from 'expo-router';
import { View } from 'react-native';
import React from 'react';
import CustomCarousel from '~/components/customCarousel';
import maincarousel from 'assets/dummy/maincarousel.json';
import MainMenu from '~/components/maincategory/mainmenu';

export default function Events() {
  return (
    <View className="bg-white">
      {/* 전체 화면을 차지 */}
      {/* 스택 타이틀 설정 */}
      <Stack.Screen options={{ title: 'HOME' }} />
      {/* 캐러셀 삽입 */}
      <View>
        {/* 여기에 패딩을 적용 */}
        <CustomCarousel items={maincarousel} />
      </View>

      <View className="flex-row justify-around">
        <MainMenu />
      </View>
    </View>
  );
}
