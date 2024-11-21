import { useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1 }}>
          <Stack.Screen
            options={{
              headerTitle: '3단어 글쓰기',
              headerTitleAlign: 'center',
              headerTintColor: '#D812DC',
              headerStyle: {
                backgroundColor: 'white',
              },
            }}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Words Display Section */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>
                Today's Words
              </Text>
              {todayWords?.map((word: Word) => (
                <View
                  key={word.word_id}
                  style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    backgroundColor: '#f9f9f9',
                    padding: 16,
                  }}>
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
            <View style={{ marginBottom: 24 }}>
              <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '500' }}>
                Write your sentence using the words above:
              </Text>
              <TextInput
                style={{
                  minHeight: 100,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#e2e2e2',
                  backgroundColor: '#f9f9f9',
                  padding: 12,
                  textAlignVertical: 'top',
                }}
                multiline
                placeholder="Create a sentence using the three words..."
                value={sentence}
                onChangeText={setSentence}
              />
            </View>

            {/* 여백을 위한 빈 공간 */}
            <View style={{ height: Platform.OS === 'android' ? 100 : 80 }} />
          </ScrollView>

          {/* Submit Button - ScrollView 밖에 고정 */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              padding: 16,
              paddingBottom: Platform.OS === 'android' ? 26 : 16,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              elevation: 5,
              marginBottom: Platform.OS === 'android' ? 36 : 0,
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 8,
                padding: 16,
                backgroundColor: isSubmitDisabled ? '#e2e2e2' : '#B227D4',
              }}
              disabled={isSubmitDisabled}
              onPress={handleSubmit}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {isSubmitDisabled ? 'Write a sentence first' : 'Submit Sentence'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
