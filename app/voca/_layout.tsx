import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function VocaLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackVisible: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Voca Section',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="detail/[id]/index"
        options={{
          headerTitle: '',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
