import { Ionicons } from '@expo/vector-icons';
import { format, formatDate } from 'date-fns';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useConsultationById } from '~/queries/hooks/posts/useConsultations';
import { getStatusText } from '~/types/consultation';

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

  if (!consultation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>상담 정보를 찾을 수 없습니다.</Text>
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
      <ScrollView className="flex-1 bg-white">
        {/* 상담 작성자 정보 */}
        <View className="border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: consultation.user_profile_picture_url || undefined }}
                className="h-10 w-10 rounded-full bg-gray-200"
                contentFit="cover"
              />
              <View className="ml-3">
                <View className="flex-row items-center">
                  <Text className="font-bold">{consultation.username}</Text>
                  <Text className="ml-2 text-sm text-gray-500">Lv.{consultation.user_level}</Text>
                </View>
                <Text className="text-sm text-gray-500">
                  {format(new Date(consultation.created_at), 'yyyy.MM.dd HH:mm')}
                </Text>
              </View>
            </View>
            <Text className="text-2xl">{consultation.country_flag_icon}</Text>
          </View>
        </View>

        {/* 상담 내용 */}
        <View className="p-4">
          <Text className="mb-2 text-2xl font-bold">{consultation.post_content.title}</Text>

          {/* 상담 정보 */}
          <View className="mb-4 rounded-lg bg-gray-100 p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-600">상담 비용</Text>
              <Text className="text-lg font-bold text-purple-500">
                {consultation.post_content.price.toLocaleString()} P
              </Text>
            </View>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-600">상담 상태</Text>
              <Text className="font-bold text-blue-500">
                {getStatusText(consultation.post_content.status)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">상담 유형</Text>
              <Text className="font-bold text-gray-700">{consultation.category_name}</Text>
            </View>
          </View>

          {/* 이미지 */}
          {consultation.media && consultation.media.length > 0 && (
            <ScrollView horizontal className="mb-4" showsHorizontalScrollIndicator={false}>
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

          {/* 상담 내용 */}
          <Text className="text-base leading-6 text-gray-800">
            {consultation.post_content.content}
          </Text>
        </View>

        {/* 선생님 정보 (있는 경우) */}
        {consultation.post_content.teacher && (
          <View className="mt-4 border-t border-gray-200 p-4">
            <Text className="mb-2 text-lg font-bold">담당 선생님</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: consultation.post_content.teacher.profile_picture_url || undefined,
                  }}
                  className="h-10 w-10 rounded-full bg-gray-200"
                  contentFit="cover"
                />
                <View className="ml-3">
                  <Text className="font-bold">{consultation.post_content.teacher.username}</Text>
                  <Text className="text-sm text-gray-500">
                    Lv.{consultation.post_content.teacher.level}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl">
                {consultation.post_content.teacher.country?.flag_icon}
              </Text>
            </View>
          </View>
        )}

        {/* 댓글 섹션 */}
        <View className="mt-4 border-t border-gray-200 p-4">
          <Text className="mb-4 text-lg font-bold">댓글</Text>
          {consultation.comments && consultation.comments.length > 0 ? (
            consultation.comments.map((comment, index) => (
              <View key={index} className="mb-4 border-b border-gray-100 pb-4 last:border-b-0">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: comment.user?.profile_picture_url || undefined }}
                      className="h-8 w-8 rounded-full bg-gray-200"
                      contentFit="cover"
                    />
                    <View className="ml-2">
                      <Text className="font-bold">{comment.user?.username}</Text>
                      <Text className="text-xs text-gray-500">
                        {format(new Date(comment.created_at), 'yyyy.MM.dd HH:mm')}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="mt-2 text-gray-700">{comment.content}</Text>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">아직 댓글이 없습니다.</Text>
              <Text className="mt-1 text-sm text-gray-400">첫 댓글을 작성해보세요!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
