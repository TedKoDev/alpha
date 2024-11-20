import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { View, Text, Image, Pressable } from 'react-native';

export default function InstagramStyleItem({ event }: any) {
  return (
    <View className="bg-white">
      {/* 프로필 헤더 */}
      <View className="flex-row items-center p-3">
        <FontAwesome name="user-circle" size={32} color="#666" />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold">{event.author}</Text>
            <Text className="text-xs text-gray-500">{dayjs(event.datetime).format('MM/DD')}</Text>
          </View>
          {event.category && <Text className="text-xs text-gray-500">{event.category}</Text>}
        </View>
      </View>

      {event.image ? (
        // 이미지가 있는 경우
        <Image source={{ uri: event.image }} className="h-96 w-full" resizeMode="cover" />
      ) : (
        // 이미지가 없는 경우 - 텍스트만 표시
        <View className="px-3">
          <Text className="text-base leading-6" numberOfLines={3}>
            {event.content}
          </Text>
        </View>
      )}

      {/* 액션 버튼들 */}
      <View className="mt-2 flex-row items-center p-3">
        <View className="flex-row items-center">
          <Feather name="heart" size={20} color="gray" />
          <Text className="ml-2 text-sm text-gray-600">{event.likes}</Text>
        </View>
        <View className="ml-4 flex-row items-center">
          <Feather name="message-circle" size={20} color="gray" />
          <Text className="ml-2 text-sm text-gray-600">{event.comments}</Text>
        </View>
        <View className="ml-4 flex-row items-center">
          <Feather name="eye" size={20} color="gray" />
          <Text className="ml-2 text-sm text-gray-600">{event.views}</Text>
        </View>
      </View>
    </View>
  );
}
