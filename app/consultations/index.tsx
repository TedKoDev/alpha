import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

import ConsultationListItem from '~/components/ConsultationListItem';
import ListLayout from '~/components/layouts/ListLayout';
import { useConsultations } from '~/queries/hooks/posts/useConsultations';

const ITEMS_PER_PAGE = 10;

export default function ConsultationsScreen() {
  const { data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching } = useConsultations({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });
  console.log('ddd', data);

  const flattenedData = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '상담 목록',
          headerTitleAlign: 'center',
        }}
      />
      <ListLayout
        headerTitle="상담 목록"
        data={flattenedData}
        isLoading={isLoading}
        onLoadMore={() => hasNextPage && fetchNextPage()}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        showWriteButton
        writeRoute="/write/writeforconsultation"
        showViewToggle={false}
        renderItem={({ item }) => <ConsultationListItem consultation={item} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-500">상담 내역이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={{ backgroundColor: '#f5f5f5' }}
      />
    </>
  );
}
