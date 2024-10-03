import { Stack } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import EventListingItem from '~/components/EventListingItem';

import events from 'assets/events.json'; // JSON 데이터 import
import { ScreenContent } from '~/components/ScreenContent';
import React from 'react';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Feed' }} />
      {/* 이벤트 리스트 렌더링 */}
      <FlatList
        data={events}
        className="bg-white"
        renderItem={({ item }) => <EventListingItem event={item} />}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}
