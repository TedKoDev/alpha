import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useConsultationById } from '~/queries/hooks/posts/useConsultations';

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: consultation, isLoading } = useConsultationById(Number(id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-600';
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  const content = consultation?.post_content;

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

      <ScrollView className="flex-1 bg-gray-50">
        {/* 상단 정보 카드 */}
        <View className="bg-white p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: consultation?.user_profile_picture_url || 'https://via.placeholder.com/40',
                }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
              <View className="ml-3">
                <Text className="font-bold">{consultation?.username}</Text>
                <Text className="text-xs text-gray-500">
                  Lv {consultation?.user_level} · {consultation?.country_name}
                </Text>
              </View>
            </View>
            <View className={`rounded-full px-4 py-2 ${getStatusColor(content?.status)}`}>
              <Text className="font-medium">{content?.status}</Text>
            </View>
          </View>
          {/* 나머지 상담 상세 정보 표시 */}
        </View>
      </ScrollView>
    </>
  );
}
