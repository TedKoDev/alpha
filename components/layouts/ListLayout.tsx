import { Ionicons, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import EventListingItem from '~/components/EventListingItem';
import InstagramStyleItem from '~/components/InstagramStyleItem';

interface ListLayoutProps {
  headerTitle: string;
  data: any[];
  showViewToggle?: boolean;
  showWriteButton?: boolean;
  hideButton?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => Promise<any>;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  renderItem?: ({ item }: { item: any }) => React.ReactElement;
  defaultViewMode?: 'list' | 'instagram';
}

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
  writeRoute = '/write',
  hideHeader = false,
  onScroll,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  renderItem,
  defaultViewMode = 'list',
}: ListLayoutProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'instagram'>(defaultViewMode);

  // console.log('data', JSON.stringify(data, null, 2));

  useEffect(() => {
    if (data?.length) {
      const imageUrls = data.reduce((acc: string[], item) => {
        if (item.media?.length) {
          acc.push(item.media[0].media_url);
        }
        if (item.user_profile_picture_url) {
          acc.push(item.user_profile_picture_url);
        }
        return acc;
      }, []);

      Image.prefetch(imageUrls);
    }
  }, [data]);

  const toggleViewMode = () => {
    const nextMode = viewMode === 'list' ? 'instagram' : 'list';
    if (data?.length) {
      const imageUrls = data.reduce((acc: string[], item) => {
        if (item.media?.length) {
          acc.push(item.media[0].media_url);
        }
        return acc;
      }, []);

      Image.prefetch(imageUrls);
    }
    setViewMode(nextMode);
  };

  const HeaderRight = () => {
    return (
      <View className="flex-row items-center">
        {showWriteButton && (
          <TouchableOpacity
            onPress={() => {
              console.log('write button pressed');
              router.push(writeRoute as any);
            }}
            className="mr-4">
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
      {/* {!hideHeader && ( */}
      <Stack.Screen
        options={{
          title: headerTitle,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerLeft: () =>
            hideButton ? null : (
              <Pressable
                onPress={() => {
                  console.log('back pressed');
                  router.back();
                }}
                style={({ pressed }) => ({
                  marginLeft: 16,
                  padding: 8,
                  opacity: pressed ? 0.5 : 1,
                  zIndex: 999,
                  elevation: 2,
                  position: 'relative',
                })}>
                <Ionicons name="chevron-back" size={24} color="#B227D4" />
              </Pressable>
            ),
          headerRight: () => (
            <View
              style={{
                zIndex: 2,
                elevation: 2,
                position: 'relative',
              }}>
              <HeaderRight />
            </View>
          ),
        }}
      />
      {/* )} */}

      <FlatList
        data={data}
        key={viewMode}
        renderItem={({ item }) =>
          renderItem ? (
            renderItem({ item })
          ) : viewMode === 'list' ? (
            <EventListingItem event={item} />
          ) : (
            <InstagramStyleItem event={item} />
          )
        }
        keyExtractor={(item) => item.post_id}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-white" />}
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
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={contentContainerStyle}
      />
    </View>
  );
}
