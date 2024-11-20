import { useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { useRefreshUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useAddPost } from '~/queries/hooks/posts/usePosts';
import { useWords, Word } from '~/queries/hooks/word/useWords';
import { useAuthStore } from '~/store/authStore';

export default function WriteWithWordsScreen() {
  const { data: todayWords, isLoading } = useWords();
  const userInfo = useAuthStore((state) => state.userInfo);
  const refreshUserInfo = useRefreshUserInfo();
  const addPost = useAddPost();
  const [sentence, setSentence] = useState('');
  const queryClient = useQueryClient();

  const isSubmitDisabled = sentence.trim() === '';

  const handleSubmit = () => {
    addPost.mutate(
      {
        content: sentence,
        type: 'SENTENCE',
        categoryId: 2,
        title: `3단어 글쓰기 + ${userInfo?.username} + ${new Date().toLocaleDateString()}`,
      },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['posts'] }),
            queryClient.invalidateQueries({ queryKey: ['logs'] }),
            refreshUserInfo(),
          ]);

          router.push('/(tabs)');
        },
        onError: (error) => {
          console.error('Failed to submit sentence:', error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading words...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: '3단어 글쓰기',
          headerBackTitleVisible: false,
          headerTintColor: '#D812DC',
        }}
      />

      <View className="flex-1">
        <ScrollView className="flex-1 p-4">
          {/* Words Display Section */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-bold">Today's Words</Text>
            {todayWords?.map((word: Word) => (
              <View key={word.word_id} className="mb-4 rounded-lg bg-gray-50 p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-[#B227D4]">{word.word}</Text>
                  <Text className="text-sm text-gray-500">{word.part_of_speech}</Text>
                </View>
                <View className="mt-2">
                  <Text className="text-base text-gray-700">
                    <Text className="font-medium">Meaning: </Text>
                    {word.meaning_en}
                  </Text>
                </View>
                <View className="mt-3">
                  <Text className="text-sm text-gray-600">
                    <Text className="font-medium">Example: </Text>
                    {word.example_sentence}
                  </Text>
                  <Text className="text-sm italic text-gray-500">{word.example_translation}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Writing Section */}
          <View className="mb-6">
            <Text className="mb-2 text-base font-medium">
              Write your sentence using the words above:
            </Text>
            <TextInput
              className="min-h-[100] rounded-lg border border-gray-200 bg-gray-50 p-3"
              multiline
              placeholder="Create a sentence using the three words..."
              value={sentence}
              onChangeText={setSentence}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`rounded-lg p-4 ${isSubmitDisabled ? 'bg-gray-400' : 'bg-[#B227D4]'}`}
            disabled={isSubmitDisabled}
            onPress={handleSubmit}>
            <Text className="text-center text-base font-bold text-white">
              {isSubmitDisabled ? 'Write a sentence first' : 'Submit Sentence'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
