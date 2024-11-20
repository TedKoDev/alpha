import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';

export default function EventListItem({ event }: any) {
  return (
    <Link href={`/event/${event.id}`} asChild>
      <Pressable className="border-b border-gray-200 bg-white p-4">
        {/* Header with time and author */}
        <View className="mb-2 flex-row items-center">
          <Text className="text-sm text-gray-500">
            {event.author} · {dayjs(event.datetime).format('MM/DD')}
          </Text>
        </View>

        {/* Content layout changes based on image existence */}
        <View className={`flex-row ${event.image ? 'gap-4' : ''}`}>
          <View className={`flex-1 ${event.image ? 'flex-[2]' : ''}`}>
            <Text className="mb-2 text-lg font-bold" numberOfLines={2}>
              {event.title}
            </Text>
            <Text className="text-base text-gray-600" numberOfLines={2}>
              {event.description || event.location}
            </Text>
          </View>

          {event.image && (
            <View className="flex-1">
              <Image
                source={{ uri: event.image }}
                className="h-20 w-full rounded-md"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Footer with engagement metrics */}
        <View className="mt-3 flex-row items-center">
          <View className="flex-row items-center">
            <Feather name="eye" size={16} color="gray" />
            <Text className="ml-1 text-sm text-gray-500">{event.views || 23}</Text>
          </View>
          <View className="ml-4 flex-row items-center">
            <Feather name="message-square" size={16} color="gray" />
            <Text className="ml-1 text-sm text-gray-500">{event.comments || 9}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
