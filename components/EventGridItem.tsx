import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { View, Image, Pressable, Dimensions } from 'react-native';

export default function EventGridItem({ event }: any) {
  const screenWidth = Dimensions.get('window').width;
  const itemSize = screenWidth / 3; // 3열 그리드

  return (
    <Link href={`/event/${event.id}`} asChild>
      <Pressable
        style={{
          width: itemSize,
          height: itemSize,
        }}>
        <Image
          source={{ uri: event.image }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        />
      </Pressable>
    </Link>
  );
}
