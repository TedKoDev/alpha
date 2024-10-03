import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import JobIcon from '../../assets/icons/job.svg';
import SchoolIcon from '../../assets/icons/school.svg';
import TopicTestIcon from '../../assets/icons/topictest.svg';
import TravelIcon from '../../assets/icons/travel.svg';
import ContractIcon from '../../assets/icons/contract.svg';
import VocaIcon from '../../assets/icons/voca.svg';

interface MenuItemProps {
  color: string;
  label: string;
  route: string;
  icon: React.FC<any>; // SVG 컴포넌트 타입
}

const MenuItem: React.FC<MenuItemProps> = ({ color, label, route, icon: Icon }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(route as never); // 클릭 시 라우터 이동
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 20,
      }}>
      {/* 아이콘과 배경색 */}
      <View
        style={{
          backgroundColor: color,
          width: 50, // 아이콘 배경 가로 크기
          height: 50, // 아이콘 배경 세로 크기
          borderRadius: 14, // 배경의 둥근 모서리
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon width={35} height={35} />
      </View>
      {/* 라벨 */}
      <Text style={{ color: '#000000', fontSize: 14, marginTop: 8 }}>{label}</Text>
      {/* 라벨 크기 */}
    </TouchableOpacity>
  );
};

const MainMenu = () => {
  const menuItems = [
    { color: '#ADD8FF', label: 'VOCA', route: 'SportsField', icon: VocaIcon },
    { color: '#D1B3FF', label: 'TOPIK', route: 'Glamping', icon: TopicTestIcon },
    { color: '#FFCCFF', label: 'Edu', route: 'Accommodation', icon: SchoolIcon },
    { color: '#FFEB3B', label: 'JOB', route: 'EmotionalStay', icon: JobIcon },
    { color: '#00FFCC', label: 'AGENCY', route: 'Activity', icon: TravelIcon },
  ];

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 }}>
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
