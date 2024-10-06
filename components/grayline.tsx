import { StyleSheet, View } from 'react-native';
import React from 'react';

const GrayLine = ({ thickness, marginTop = 0, marginBottom = 0 }: any) => {
  return <View style={[styles.line, { height: thickness, marginTop, marginBottom }]} />;
};

export default GrayLine;

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#D3D3D3', // 회색
    width: '100%', // 화면 전체 가로 길이
  },
});
