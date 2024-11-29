import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { ConsultationFilterHeader } from '~/components/consultation/ConsultationFilterHeader';
import { SortModal } from '~/components/consultation/SortModal';

import ConsultationListItem from '~/components/ConsultationListItem';
import ListLayout from '~/components/layouts/ListLayout';
import { useConsultations } from '~/queries/hooks/posts/useConsultations';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { ConsultationStatus, ConsultationFilters } from '~/types/consultation';

const ITEMS_PER_PAGE = 10;

export default function ConsultationsScreen() {
  const { data: topicsData } = useTopics();
  const [filters, setFilters] = useState<ConsultationFilters>({
    status: undefined,
    sort: 'latest',
    topic_id: 1,
    category_id: undefined,
  });
  const [showSortModal, setShowSortModal] = useState(false);

  const selectedTopic = topicsData?.find((topic) => topic.topic_id === filters.topic_id);

  useEffect(() => {
    console.log('Current filters:', filters);
  }, [filters]);

  const { data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching } = useConsultations({
    page: 1,
    limit: ITEMS_PER_PAGE,
    ...filters,
  });

  useEffect(() => {
    if (data) {
      // console.log('Received data:', data.pages[0].data);
    }
  }, [data]);

  const flattenedData = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <Stack.Screen options={{ headerTitle: '상담 목록' }} />
      <ListLayout
        data={flattenedData}
        isLoading={isLoading}
        onLoadMore={() => hasNextPage && fetchNextPage()}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        showWriteButton
        writeRoute="/write/writeforconsultation"
        ListHeaderComponent={
          <ConsultationFilterHeader
            selectedStatus={filters.status}
            selectedSort={filters.sort}
            selectedCategoryId={filters.category_id}
            showSortModal={showSortModal}
            setSelectedStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
            setSelectedSort={(sort) => setFilters((prev) => ({ ...prev, sort }))}
            setSelectedCategoryId={(id) => setFilters((prev) => ({ ...prev, category_id: id }))}
            setShowSortModal={setShowSortModal}
            topicsData={topicsData}
          />
        }
        renderItem={({ item }) => <ConsultationListItem consultation={item} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-500">상담 내역이 없습니다.</Text>
          </View>
        }
      />
      <SortModal
        visible={showSortModal}
        selectedSort={filters.sort}
        onSelect={(sort) => {
          setFilters((prev) => ({ ...prev, sort }));
          setShowSortModal(false);
        }}
        onClose={() => setShowSortModal(false)}
      />
    </>
  );
}
