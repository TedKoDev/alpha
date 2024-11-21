import { Ionicons, Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';

type ListLayoutProps = {
  headerTitle: string;
  data: any[];
  showViewToggle?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  hideButton?: boolean;
  showWriteButton?: boolean;
};

export default function ListLayout({
  headerTitle,
  data,
  showViewToggle = true,
  isLoading = false,
  onLoadMore,
  onRefresh,
  isRefreshing = false,
  hideButton = false,
  showWriteButton = false,
}: ListLayoutProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>('list');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'list' ? 'instagram' : 'list'));
  };

  const HeaderRight = () => {
    return (
      <View className="flex-row items-center">
        {showWriteButton && (
          <TouchableOpacity onPress={() => router.push('/write')} className="mr-4">
            <Feather name="edit" size={24} color="#B227D4" />
          </TouchableOpacity>
        )}
        {showViewToggle && (
          <TouchableOpacity onPress={toggleViewMode} className="mr-4">
            <Feather name={viewMode === 'list' ? 'grid' : 'list'} size={24} color="#B227D4" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerLeft: () =>
            hideButton ? null : (
              <TouchableOpacity onPress={() => router.back()} className="ml-4">
                <Ionicons name="chevron-back" size={24} color="#B227D4" />
              </TouchableOpacity>
            ),
          headerRight: HeaderRight,
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
        keyExtractor={(item) => item.post_id.toString()}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-100" />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListFooterComponent={() =>
          isLoading ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  );
}
