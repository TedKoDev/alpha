import React from 'react';
import { View, Text } from 'react-native';
import LevelCards from './components/levelcards'; // default export일 경우 중괄호 없이 import

const IndexPage = () => {
  return (
    <View>
      <LevelCards />
    </View>
  );
};

export default IndexPage;
