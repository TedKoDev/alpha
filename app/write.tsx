import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function WriteScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: '글쓰기',
        }}
      />
      <Text>Write Screen</Text>
    </View>
  );
}
