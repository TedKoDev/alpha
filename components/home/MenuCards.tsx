import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

const menuItems = [
  {
    title: 'Check Academic Calendar',
    korTitle: '한국 대학 학사일정 보러가기',
    color: 'bg-blue-400',
    icon: <MaterialIcons className="mr-4" name="event-note" size={24} color="white" />,
    route: '/calendar',
  },
  {
    title: 'Study Korean',
    korTitle: '한국어 공부 하러가기',
    color: 'bg-green-400',
    icon: <FontAwesome5 className="mr-4" name="book-reader" size={24} color="white" />,
    route: '/study',
  },
  {
    title: 'Book Bella Classes',
    korTitle: 'Bella 선생님 강의 신청하러 가기',
    color: 'bg-purple-400',
    icon: <Ionicons className="mr-4" name="school" size={24} color="white" />,
    route: '/classes',
  },
];

export default function MenuCards() {
  return (
    <View className="p-4">
      {menuItems.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => router.push(item.route)}
          className={`mb-4 h-24 rounded-lg ${item.color} flex-row items-center justify-between px-6`}>
          <View className="flex-row items-center space-x-3">
            {item.icon}
            <View>
              <Text className="font-bold text-white">{item.title}</Text>
              <Text className="text-white">{item.korTitle}</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
        </Pressable>
      ))}
    </View>
  );
}
