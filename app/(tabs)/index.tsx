import { Stack } from 'expo-router';
import { FlatList, View } from 'react-native';
import React from 'react';
import events from 'assets/events.json'; // JSON 데이터 import
import EventListingItem from '~/components/EventListingItem';

export default function Events() {
  return (
    <>
      {/* 스택 타이틀 설정 */}
      <Stack.Screen options={{ title: 'Events' }} />

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
