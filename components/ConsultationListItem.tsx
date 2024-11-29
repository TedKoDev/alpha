import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { ConsultationStatus, getStatusText, getStatusColor } from '~/types/consultation';

export default function ConsultationListItem({ consultation }: any) {
  const { post_content: content } = consultation;

  // console.log('vvv', content);

  // console.log('Consultation Status:', content.status);

  return (
    <Link href={`/consultations/${consultation.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white p-4">
        {/* 상단: 사용자 정보 & 시간 */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: consultation.user_profile_picture_url || 'https://via.placeholder.com/32',
              }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
              contentFit="cover"
              transition={200}
            />
            <Text className="ml-2 text-sm text-gray-500">{consultation.username}</Text>
            <Text className="ml-2 text-xs text-orange-400">Lv {consultation.user_level}</Text>
          </View>
          <Text className="text-xs text-gray-500">
            {dayjs(consultation.created_at).format('YY/MM/DD HH:mm')}
          </Text>
        </View>

        {/* 중단: 제목 & 상태 */}
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-bold" numberOfLines={1}>
            {content.title}
          </Text>
          <View
            className={`ml-2 rounded-full px-3 py-1 ${getStatusColor(content.status as ConsultationStatus)}`}>
            <Text className="text-xs font-medium">
              {getStatusText(content.status as ConsultationStatus)}
            </Text>
          </View>
        </View>

        {/* 하단: 카테고리, 가격, 댓글 수 */}
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-purple-500">{consultation.category_name}</Text>
            <Text className="ml-2 text-sm font-semibold text-green-600">{content.price}P</Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="message-square" size={16} color="gray" />
            <Text className="ml-1 text-sm text-gray-500">{consultation.comment_count}</Text>
          </View>
        </View>

        {content.teacher_id && (
          <View className="mt-3 flex-row items-center">
            <Text className="text-xs text-gray-500">답변 선생님: </Text>
            <Image
              source={{
                uri: content.teacher_profile_picture_url || 'https://via.placeholder.com/24',
              }}
              style={{ width: 16, height: 16, borderRadius: 8, marginLeft: 4 }}
              contentFit="cover"
            />
            <Text className="ml-1 text-xs text-gray-700">{content.teacher_name}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
