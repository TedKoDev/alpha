import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Detail() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Level ${id}`,
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTitleStyle: {
        color: '#000',
        fontSize: 18,
      },
    });
  }, [id, navigation]);

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
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
