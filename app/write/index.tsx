import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useAddPost } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { queryClient } from '~/queries/queryClient';
import { CreateMediaDto, CreatePostDto } from '~/services/postService';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';

type PostType = 'SENTENCE' | 'COLUMN' | 'QUESTION' | 'GENERAL';

const MAX_IMAGES = 5; // 최대 이미지 개수 상수 추가

export default function WriteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('GENERAL');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [points, setPoints] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string }[]>([]);

  // 토픽 목록 가져오기
  const { data: topics = [] } = useTopics();
  //console.log('topics', JSON.stringify(topics, null, 2));

  // 선택된 토픽의 카테고리 찾기
  const selectedTopicCategories =
    topics.find((topic) => topic.topic_id === selectedTopic)?.category || [];

  const addPost = useAddPost();

  const postTypes: { type: PostType; label: string }[] = [
    { type: 'GENERAL', label: 'General' },
    { type: 'SENTENCE', label: 'Today Words' },
    { type: 'COLUMN', label: 'Column' },
    { type: 'QUESTION', label: 'Question' },
  ];

  const pickImages = async () => {
    try {
      if (selectedImages.length >= MAX_IMAGES) {
        Alert.alert('Notice', 'You can only upload up to 5 images.');
        return;
      }

      setIsImageLoading(true);

      const remainingSlots = MAX_IMAGES - selectedImages.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: remainingSlots, // 남은 슬롯만큼만 선택 가능
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
        }));
        setSelectedImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to select images');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!content.trim()) {
        Alert.alert('Notice', 'Please enter content.');
        return;
      }
      if (!selectedCategory) {
        Alert.alert('Notice', 'Please select a category.');
        return;
      }

      setIsImageLoading(true);

      // 이미지 업로드 처리
      const uploadedUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const extension = image.uri.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const { url } = await getPresignedUrlApi(fileName, image.type);
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await uploadFileToS3(url, blob);
          return url.split('?')[0];
        })
      );

      const mediaData = uploadedUrls.map((url) => ({
        mediaUrl: url,
        mediaType: 'IMAGE',
      }));

      const postData: CreatePostDto = {
        title: title.trim(),
        content: content.trim(),
        type: selectedType,
        categoryId: selectedCategory,
        media: mediaData as CreateMediaDto[],
        ...(selectedType === 'QUESTION' && { points: parseInt(points, 10) || 0 }),
      };

      // 게시글 작성
      await addPost.mutateAsync(postData);

      // 데이터 갱신을 기다림
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.refetchQueries({ queryKey: ['posts'] });

      // 잠시 대기 후 화면 전환
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      console.error('Post creation failed:', error);
      Alert.alert('Error', 'Failed to create post.');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleTypeSelect = (type: PostType) => {
    if (type === 'SENTENCE') {
      Alert.alert('Write Sentence', 'Would you like to move to the sentence writing page?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => router.push('/write/with-words'),
        },
      ]);
    } else {
      setSelectedType(type);
    }
  };

  const { data: userInfo } = useUserInfo();

  const isPointsValid = !points || parseInt(points, 10) <= (userInfo?.points || 0);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Post',
          headerShadowVisible: true,
          headerTitleAlign: 'center',

          headerBackVisible: true,
          headerTintColor: '#D812DC',
          headerStyle: {
            backgroundColor: 'white',
          },
        }}
      />
      <ScrollView className="flex-1 bg-white p-4">
        {/* Type selection with horizontal scroll */}
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Post Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {postTypes.map(({ type, label }) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleTypeSelect(type)}
                  className={`rounded-full px-4 py-2 ${
                    selectedType === type ? 'bg-purple-500' : 'bg-gray-200'
                  }`}>
                  <Text className={selectedType === type ? 'text-white' : 'text-gray-700'}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Title input */}
        <TextInput
          className="mb-4 rounded-lg border border-gray-300 p-3"
          placeholder="✏️ Title (optional)"
          value={title}
          onChangeText={setTitle}
        />

        {/* Content input */}
        <TextInput
          className="mb-4 h-40 rounded-lg border border-gray-300 p-3"
          placeholder="✍️ Content"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* Topic Selection with horizontal scroll */}
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Topic</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.topic_id}
                  onPress={() => {
                    setSelectedTopic(topic.topic_id);
                    setSelectedCategory(null);
                  }}
                  className={`rounded-full px-4 py-2 ${
                    selectedTopic === topic.topic_id ? 'bg-purple-500' : 'bg-gray-200'
                  }`}>
                  <Text
                    className={selectedTopic === topic.topic_id ? 'text-white' : 'text-gray-700'}>
                    {topic.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Category Selection with horizontal scroll */}
        {selectedTopic && (
          <View className="mb-4">
            <Text className="mb-2 text-gray-600">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {selectedTopicCategories.map((category) => (
                  <TouchableOpacity
                    key={category.category_id}
                    onPress={() => setSelectedCategory(category.category_id)}
                    className={`rounded-full px-4 py-2 ${
                      selectedCategory === category.category_id ? 'bg-purple-500' : 'bg-gray-200'
                    }`}>
                    <Text
                      className={
                        selectedCategory === category.category_id ? 'text-white' : 'text-gray-700'
                      }>
                      {category.category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Points input for Question type */}
        {selectedType === 'QUESTION' && (
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-600">Set Points</Text>
              <Text className="text-gray-600">
                Your points:{' '}
                <Text className="font-bold text-purple-600">{userInfo?.points || 0}P</Text>
              </Text>
            </View>
            <View className="flex-row items-center">
              <TextInput
                className={`flex-1 rounded-lg border ${
                  isPointsValid ? 'border-gray-300' : 'border-red-500'
                } p-3`}
                placeholder="Enter points"
                value={points}
                onChangeText={setPoints}
                keyboardType="numeric"
              />
              <Text className="ml-2 text-gray-600">P</Text>
            </View>
            {!isPointsValid && (
              <Text className="mt-1 text-sm text-red-500">You don't have enough points</Text>
            )}
            <Text className="mt-1 text-sm text-gray-500">
              * Points will be awarded to the person who answers your question
            </Text>
          </View>
        )}

        {/* Image attachment */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={pickImages}
              disabled={isImageLoading || selectedImages.length >= MAX_IMAGES}
              className="flex-row items-center rounded-lg bg-gray-100 p-3">
              {isImageLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Ionicons name="image-outline" size={24} color="#666" />
              )}
              <Text className="ml-2">{isImageLoading ? 'Loading images...' : 'Add Images'}</Text>
            </TouchableOpacity>

            {/* 이미지 카운터 추가 */}
            <Text className="text-sm text-gray-600">
              {selectedImages.length}/{MAX_IMAGES}
            </Text>
          </View>

          {/* Image preview */}
          <ScrollView horizontal className="mt-2">
            {selectedImages.map((image, index) => (
              <View key={index} className="mr-2">
                <View className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className="h-20 w-20 rounded-lg"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoadEnd={() => setIsImageLoading(false)}
                  />
                  {isImageLoading && (
                    <View className="absolute inset-0 items-center justify-center rounded-lg bg-black/10">
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                  <TouchableOpacity
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                    onPress={() =>
                      setSelectedImages((images) => images.filter((_, i) => i !== index))
                    }>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg bg-purple-500 p-4"
          disabled={addPost.isPending}>
          <Text className="text-center font-bold text-white">
            {addPost.isPending ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
