import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import HotList from './HotList';
import Notice from './Notice';
import BelaPick from './belapick';

import { useBoardStore } from '~/store/boardStore';

const tabs = [
  { id: 'Bera', title: "Bera's Pick", component: BelaPick },
  { id: 'notice', title: 'Notice', component: Notice },
  { id: 'hot', title: 'Hot Posts', component: HotList },
];

export default function BoardTabs() {
  const [activeTab, setActiveTab] = useState('Bera');
  const { cachedPosts } = useBoardStore();

  // 모든 탭의 이미지를 미리 로드
  useEffect(() => {
    const allPosts = [...cachedPosts.Bera, ...cachedPosts.notice, ...cachedPosts.hot];

    const imageUrls = allPosts.reduce((acc: string[], item) => {
      if (item.media?.length) {
        const activeMedia = item.media.filter((m: any) => !m.deleted_at);
        activeMedia.forEach((media: any) => {
          acc.push(media.media_url);
        });
      }
      if (item.user_profile_picture_url) {
        acc.push(item.user_profile_picture_url);
      }
      return acc;
    }, []);

    Image.prefetch(imageUrls);
  }, [cachedPosts]);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || BelaPick;

  return (
    <View>
      {/* Tab Headers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`px-4 py-3 ${activeTab === tab.id ? 'border-b-2 border-[#B227D4]' : ''}`}>
            <Text
              className={`text-base ${
                activeTab === tab.id ? 'font-bold text-[#B227D4]' : 'text-gray-600'
              }`}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Tab Content */}
      <ActiveComponent />
    </View>
  );
}
