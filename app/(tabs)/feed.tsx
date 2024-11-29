import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { FilterHeader } from '~/components/feed/FilterHeader';
import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';

export default function Feed() {
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [showSortModal, setShowSortModal] = useState(false);

  const [dropdownPosition, setDropdownPosition] = useState(200);

  const { data: topicsData } = useTopics();

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 15,
    sort: sortBy,
    topicId: selectedTopicId,
    categoryId: selectedCategoryId,
  });

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];

  const selectedTopic = topicsData?.find((topic) => topic.topic_id === selectedTopicId);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '인기순' },
  ] as const;

  const selectedSortLabel = sortOptions.find((option) => option.value === sortBy)?.label;

  useEffect(() => {
    if (selectedTopic?.category?.length) {
      setDropdownPosition(200);
    } else {
      setDropdownPosition(130);
    }
  }, [selectedTopic]);

  useEffect(() => {
    refetch();
  }, [selectedTopicId, selectedCategoryId, sortBy]);

  return (
    <View className="flex-1 bg-white">
      <ListLayout
        headerTitle="커뮤니티"
        data={allPosts}
        showViewToggle
        showWriteButton
        hideButton
        isLoading={isFetchingNextPage}
        onLoadMore={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        ListHeaderComponent={
          <FilterHeader
            selectedTopicId={selectedTopicId}
            selectedCategoryId={selectedCategoryId}
            topicsData={topicsData}
            selectedTopic={selectedTopic ?? undefined}
            showSortModal={showSortModal}
            selectedSortLabel={selectedSortLabel ?? '최신순'}
            setSelectedTopicId={setSelectedTopicId}
            setSelectedCategoryId={setSelectedCategoryId}
            setShowSortModal={setShowSortModal}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500">No posts available</Text>
          </View>
        }
        contentContainerStyle={{
          paddingTop: 0,
        }}
      />

      {/* Dropdown Menu - 최상위 레벨에 렌더링 */}
      {showSortModal && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: dropdownPosition,
            width: 128,
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 9999,
          }}>
          {sortOptions.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                setSortBy(value);
                setShowSortModal(false);
              }}
              className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
              <Text className="text-gray-700">{label}</Text>
              {sortBy === value && <Ionicons name="checkmark" size={20} color="#9333ea" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
