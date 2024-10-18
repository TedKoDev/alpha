import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Detail() {
  const navigate = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    navigate.setOptions({
      headerTitle: `Level ${id}`,
    });
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detail Page for Level {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
