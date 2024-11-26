import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Topic, Category } from '~/types'; // 필요한 타입을 import 해주세요
import GrayLine from '../grayline';

interface FilterHeaderProps {
  selectedTopicId: number | undefined;
  selectedCategoryId: number | undefined;
  topicsData: Topic[] | undefined;
  selectedTopic: Topic | undefined;
  showSortModal: boolean;
  selectedSortLabel: string;
  setSelectedTopicId: (id: number | undefined) => void;
  setSelectedCategoryId: (id: number | undefined) => void;
  setShowSortModal: (show: boolean) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  selectedTopicId,
  selectedCategoryId,
  topicsData,
  selectedTopic,
  showSortModal,
  selectedSortLabel,
  setSelectedTopicId,
  setSelectedCategoryId,
  setShowSortModal,
}) => (
  <View className="bg-white">
    <View className="bg-white py-4">
      {/* Topics */}
      <View className="">
        <Text className="mb-2 pl-4  text-gray-600">토픽</Text>
        <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setSelectedTopicId(undefined);
                setSelectedCategoryId(undefined);
              }}
              className={`rounded-full px-4 py-2 ${
                selectedTopicId === undefined ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
              <Text className={selectedTopicId === undefined ? 'text-white' : 'text-gray-700'}>
                전체
              </Text>
            </TouchableOpacity>
            {topicsData?.map((topic) => (
              <TouchableOpacity
                key={topic.topic_id}
                onPress={() => {
                  setSelectedTopicId(topic.topic_id);
                  setSelectedCategoryId(undefined);
                }}
                className={`rounded-full px-4 py-2 ${
                  selectedTopicId === topic.topic_id ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                <Text
                  className={selectedTopicId === topic.topic_id ? 'text-white' : 'text-gray-700'}>
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Categories */}
      {selectedTopic && (
        <View className="mt-4">
          <Text className="mb-2 pl-4 text-gray-600">카테고리</Text>
          <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSelectedCategoryId(undefined)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategoryId === undefined ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                <Text className={selectedCategoryId === undefined ? 'text-white' : 'text-gray-700'}>
                  전체
                </Text>
              </TouchableOpacity>
              {selectedTopic.category.map((category) => (
                <TouchableOpacity
                  key={category.category_id}
                  onPress={() => setSelectedCategoryId(category.category_id)}
                  className={`rounded-full px-4 py-2 ${
                    selectedCategoryId === category.category_id ? 'bg-purple-500' : 'bg-gray-200'
                  }`}>
                  <Text
                    className={
                      selectedCategoryId === category.category_id ? 'text-white' : 'text-gray-700'
                    }>
                    {category.category_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>

    {/* Sort Options Button Only */}
    <View className=" flex-row justify-end">
      <View className="mx-4">
        <TouchableOpacity
          onPress={() => setShowSortModal(!showSortModal)}
          className="flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-2">
          <Text className="text-gray-700">{selectedSortLabel}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
    <GrayLine thickness={1} marginTop={10} />
  </View>
);
