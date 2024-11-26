import { Feather, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
export default function EventSmallListItem({ event }: any) {
  const activeMedia = event.media?.filter((media: any) => media.deleted_at === null) || [];

  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white px-4 py-2">
        {/* User Info Row */}
        <View className="mb-2 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <Image
              source={{ uri: event.user_profile_picture_url || 'https://via.placeholder.com/32' }}
              style={{ width: 20, height: 20, borderRadius: 10 }}
              contentFit="cover"
              transition={200}
            />
            <Text className="ml-2 text-xs text-gray-500">{event.username}</Text>
            <Text className="ml-2 text-xs text-orange-400">{event.flag_icon}</Text>
            <Text className="ml-2 text-xs text-orange-400">Lv {event.user_level}</Text>
            <Text className="ml-2 text-xs text-gray-500">
              · {dayjs(event.created_at).format('YY/MM/DD')}
            </Text>
          </View>
        </View>

        {/* Content Row */}
        <View className={`flex-row ${activeMedia.length > 0 ? 'gap-3' : ''}`}>
          <View className="flex-1">
            <Text className="mb-1 text-sm font-bold" numberOfLines={1}>
              {event.post_content.title}
            </Text>
            <Text className="text-xs text-gray-600" numberOfLines={1}>
              {event.post_content.content}
            </Text>
          </View>

          {activeMedia.length > 0 && (
            <View className="relative">
              <Image
                source={{ uri: activeMedia[0].media_url }}
                style={{ width: 50, height: 50, borderRadius: 4 }}
                contentFit="cover"
                transition={200}
              />
              {activeMedia.length > 1 && (
                <View className="absolute bottom-1 right-1 rounded bg-black/50 px-1">
                  <Text className="text-[10px] text-white">+{activeMedia.length - 1}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Bottom Row */}
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xs text-purple-500">{event.category_name}</Text>

          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Feather name="eye" size={12} color="gray" />
              <Text className="ml-1 text-xs text-gray-500">{event.views}</Text>
            </View>
            <View className="ml-3 flex-row items-center">
              <Feather name="message-square" size={12} color="gray" />
              <Text className="ml-1 text-xs text-gray-500">{event.comment_count}</Text>
            </View>
            <View className="ml-3 flex-row items-center">
              <FontAwesome
                name={event.user_liked ? 'heart' : 'heart-o'}
                size={12}
                color={event.user_liked ? 'red' : 'gray'}
              />
              <Text className="ml-1 text-xs text-gray-500">{event.likes}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
