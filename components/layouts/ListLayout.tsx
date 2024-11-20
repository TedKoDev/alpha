import { Ionicons, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View, FlatList } from 'react-native';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';

type ListLayoutProps = {
  headerTitle: string;
  data: any[];
  showViewToggle?: boolean;
};

export default function ListLayout({ headerTitle, data, showViewToggle = true }: ListLayoutProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>('list');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'instagram' : 'list'));
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
          headerRight: showViewToggle
            ? () => (
                <TouchableOpacity onPress={toggleViewMode} className="mr-4">
                  <Feather name={viewMode === 'list' ? 'grid' : 'list'} size={24} color="#B227D4" />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <FlatList
        data={data}
        key={viewMode}
        renderItem={({ item }) =>
          viewMode === 'list' ? (
            <EventListingItem event={item} />
          ) : (
            <InstagramStyleItem event={item} />
          )
        }
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-100" />}
      />
    </View>
  );
}
