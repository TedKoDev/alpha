import { Feather, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
export default function EventListItem({ event }: any) {
  // 삭제되지 않은 미디어만 필터링
  const activeMedia = event.media?.filter((media) => media.deleted_at === null) || [];

  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white p-4">
        <View className="mb-2 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <Image
              source={{ uri: event.user_profile_picture_url || 'https://via.placeholder.com/32' }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
              contentFit="cover"
              transition={200}
            />
            <Text className="ml-2 text-sm text-gray-500">{event.username}</Text>
            <Text className="ml-2 text-xs text-orange-400">Lv {event.user_level}</Text>
            <Text className="ml-2 text-sm text-gray-500">
              · {dayjs(event.created_at).format('YY/MMM/DD')}
            </Text>
          </View>
        </View>

        <View className={`flex-row ${activeMedia.length > 0 ? 'gap-4' : ''}`}>
          <View className={`flex-1 ${activeMedia.length > 0 ? 'flex-[2]' : ''}`}>
            <Text className="mb-2 text-lg font-bold" numberOfLines={2}>
              {event.post_content.title}
            </Text>
            <Text className="text-base text-gray-600" numberOfLines={2}>
              {event.post_content.content}
            </Text>
          </View>

          {activeMedia.length > 0 && (
            <View className="relative flex-1">
              <Image
                source={{ uri: activeMedia[0].media_url }}
                style={{ width: '100%', height: 80, borderRadius: 6 }}
                contentFit="cover"
                transition={200}
              />
              {activeMedia.length > 1 && (
                <View className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-1">
                  <Text className="text-xs text-white">+{activeMedia.length - 1}</Text>
                </View>
              )}
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
              <FontAwesome
                name={event.user_liked ? 'heart' : 'heart-o'}
                size={16}
                color={event.user_liked ? 'red' : 'gray'}
              />
              <Text className="ml-1 text-sm text-gray-500">{event.likes}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
