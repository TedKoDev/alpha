import { Ionicons } from '@expo/vector-icons';
import { formatDate } from 'date-fns';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useConsultationById } from '~/queries/hooks/posts/useConsultations';

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: consultation, isLoading } = useConsultationById(Number(id));

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '상담 상세',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-white p-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold">{consultation?.title}</Text>
          <Text className="mt-2 text-gray-500">{formatDate(consultation?.created_at)}</Text>
        </View>

        {consultation?.media?.length > 0 && (
          <ScrollView horizontal className="mb-4">
            {consultation.media.map((media, index) => (
              <Image
                key={index}
                source={{ uri: media.media_url }}
                className="mr-2 h-40 w-40 rounded-lg"
                contentFit="cover"
              />
            ))}
          </ScrollView>
        )}

        <View className="mb-4 rounded-lg bg-gray-100 p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-gray-600">상담 비용</Text>
            <Text className="text-lg font-bold text-purple-500">{consultation?.base_price} P</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">상담 상태</Text>
            <Text className="font-bold text-blue-500">{consultation?.status}</Text>
          </View>
        </View>

        <Text className="text-base text-gray-800">{consultation?.content}</Text>
      </ScrollView>
    </>
  );
}
