import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function InstagramStyleItem({ event }: any) {
  return (
    <Link href={`/event/${event.post_id}`} asChild>
      <Pressable className="bg-white">
        <View className="flex-row items-center p-3">
          <Image
            source={{ uri: event.user_profile_picture_url || 'https://via.placeholder.com/32' }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit="cover"
            transition={200}
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="font-bold">{event.username}</Text>
                <Text className="ml-2 text-xs text-orange-400">Lv {event.user_level}</Text>
              </View>
              <Text className="text-xs text-gray-500">
                {dayjs(event.created_at).format('YY/MMM/DD')}
              </Text>
            </View>
          </View>
        </View>

        {event.media?.length > 0 && (
          <View className="relative">
            <Image
              source={{ uri: event.media[0].media_url }}
              style={{ width: '100%', height: 384 }}
              contentFit="cover"
              transition={200}
            />
            {event.media.length > 1 && (
              <View className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1">
                <Text className="text-sm text-white">+{event.media.length - 1}</Text>
              </View>
            )}
          </View>
        )}

        <View className="p-3">
          {event.post_content.title && (
            <Text className="mb-2 text-base font-bold">{event.post_content.title}</Text>
          )}
          {event.post_content.content && (
            <Text className="text-sm text-gray-600" numberOfLines={3}>
              {event.post_content.content}
            </Text>
          )}
        </View>

        <View className="mt-2 flex-row items-center justify-between p-3">
          <Text className="text-xs text-purple-500">{event.category_name}</Text>

          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Feather name="eye" size={20} color="gray" />
              <Text className="ml-2 text-sm text-gray-600">{event.views}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="message-circle" size={20} color="gray" />
              <Text className="ml-2 text-sm text-gray-600">{event.comments?.length || 0}</Text>
            </View>
            <View className="ml-4 flex-row items-center">
              <Feather name="heart" size={20} color="gray" />
              <Text className="ml-2 text-sm text-gray-600">{event.likes}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
