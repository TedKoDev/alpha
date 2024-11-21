import { Feather } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';

interface UserInfoProps {
  username: string;
  createdAt: string;
  user_level?: number;
  user_profile_picture_url?: string | null;
}

export default function UserInfo({
  username,
  createdAt,
  user_level = 1,
  user_profile_picture_url,
}: UserInfoProps) {
  return (
    <View className="flex-row items-center border-b border-gray-200 p-4">
      <Image
        source={{
          uri: user_profile_picture_url || 'https://via.placeholder.com/100',
        }}
        className="h-10 w-10 rounded-full"
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="text-base font-bold">{username}</Text>
          <Text className="ml-2 text-sm text-orange-400">Level {user_level}</Text>
        </View>
        <Text className="text-sm text-gray-500">{createdAt}</Text>
      </View>
      <Feather name="more-horizontal" size={24} color="#666666" />
    </View>
  );
}
