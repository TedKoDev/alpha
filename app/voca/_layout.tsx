import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import React from 'react';

export default function VocaLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* 페이지별 컨텐츠를 렌더링 */}
      <Stack>
        <Stack.Screen
          name="detail/[id]/index"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="index"
          options={{ headerTitle: 'Voca Section', headerShown: true }} // 이름을 'Voca Section'으로 변경
        />
      </Stack>
    </View>
  );
}
