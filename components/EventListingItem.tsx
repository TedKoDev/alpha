import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';

export default function EventListItem({ event }: any) {
  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white p-4">
        <View className="mb-2 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <Image
              source={{
                uri: event.user_profile_picture_url || 'https://via.placeholder.com/32',
              }}
              className="h-6 w-6 rounded-full"
            />
            <Text className="ml-2 text-sm text-gray-500">{event.username}</Text>
            <Text className="ml-2 text-xs text-orange-400">Lv {event.user_level}</Text>
            <Text className="ml-2 text-sm text-gray-500">
              · {dayjs(event.created_at).format('YY/MMM/DD')}
            </Text>
          </View>
        </View>

        <View className={`flex-row ${event.media?.length > 0 ? 'gap-4' : ''}`}>
          <View className={`flex-1 ${event.media?.length > 0 ? 'flex-[2]' : ''}`}>
            <Text className="mb-2 text-lg font-bold" numberOfLines={2}>
              {event.post_content.title}
            </Text>
            <Text className="text-base text-gray-600" numberOfLines={2}>
              {event.post_content.content}
            </Text>
          </View>

          {event.media?.length > 0 && (
            <View className="flex-1">
              <Image
                source={{ uri: event.media[0] }}
                className="h-20 w-full rounded-md"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-xs text-purple-500">{event.category_name}</Text>

          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Feather name="eye" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-500">{event.views}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="message-square" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-500">{event.comments?.length || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="heart" size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-500">{event.likes}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
