import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import JobIcon from '../../assets/icons/job.svg';
import SchoolIcon from '../../assets/icons/school.svg';
import TopicTestIcon from '../../assets/icons/topictest.svg';
import TravelIcon from '../../assets/icons/travel.svg';
import ContractIcon from '../../assets/icons/contract.svg';
import VocaIcon from '../../assets/icons/voca.svg';
import { useRouter } from 'expo-router';

interface MenuItemProps {
  color: string;
  label: string;
  route: string;
  icon: React.FC<any>; // SVG 컴포넌트 타입
}

const MenuItem: React.FC<MenuItemProps> = ({ color, label, route, icon: Icon }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(route as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        alignItems: 'center',
        marginHorizontal: 8,
        marginTop: 20,
      }}>
      <View
        style={{
          backgroundColor: color,
          width: 45,
          height: 45,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon width={30} height={30} />
      </View>
      <Text
        style={{
          color: '#000000',
          fontSize: 12,
          marginTop: 6,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const MainMenu = () => {
  const menuItems = [
    { color: '#ADD8FF', label: 'VOCA', route: '/voca', icon: VocaIcon },
    { color: '#D1B3FF', label: 'TOPIK', route: '/topik', icon: TopicTestIcon },
    { color: '#FFCCFF', label: 'Edu', route: '/edu', icon: SchoolIcon },
    { color: '#FFEB3B', label: 'JOB', route: 'EmotionalStay', icon: JobIcon },
    { color: '#00FFCC', label: 'AGENCY', route: 'Activity', icon: TravelIcon },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        width: '100%',
      }}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          color={item.color}
          label={item.label}
          route={item.route}
          icon={item.icon}
        />
      ))}
    </View>
  );
};

export default MainMenu;
