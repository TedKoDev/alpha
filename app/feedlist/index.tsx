import React from 'react';
import { View, FlatList } from 'react-native';
import EventListItem from '~/components/EventListingItem';

export default function FeedListPage() {
  const feeds = [{ id: '1', title: 'Feed 1', content: 'Content 1' }];

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={feeds}
        renderItem={({ item }) => <EventListItem feed={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
