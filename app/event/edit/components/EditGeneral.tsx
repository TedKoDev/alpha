import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
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

import { useUpdatePost } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { queryClient } from '~/queries/queryClient';
import { UpdatePostDto } from '~/services/postService';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';

const MAX_IMAGES = 5;

// 타입 상수 정의
const POST_TYPES = {
  SENTENCE: ['SENTENCE'],
  OTHERS: ['GENERAL', 'COLUMN', 'QUESTION'],
};

export default function EditGeneral({ post }) {
  const [title, setTitle] = useState(post.post_content.title || '');
  const [content, setContent] = useState(post.post_content.content || '');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(post.category_id);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string }[]>(
    post.media?.map((m) => ({ uri: m.media_url, type: 'image/jpeg' })) || []
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [points, setPoints] = useState(post.points?.toString() || '0');
  const [selectedType, setSelectedType] = useState<string>(post.type);

  const { data: topics = [] } = useTopics();
  const updatePost = useUpdatePost();

  // 초기 토픽 설정
  useEffect(() => {
    const topic = topics.find((t) => t.category.some((c) => c.category_id === post.category_id));
    if (topic) {
      setSelectedTopic(topic.topic_id);
    }
  }, [topics, post.category_id]);

  // 해당 포스트가 변경 가능한 타입들을 반환하는 함수
  const getAvailableTypes = () => {
    if (post.type === 'SENTENCE') {
      return POST_TYPES.SENTENCE;
    }
    return POST_TYPES.OTHERS;
  };

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
        selectionLimit: remainingSlots,
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
      if (selectedType === 'QUESTION' && !title.trim()) {
        Alert.alert('Notice', 'Please enter title.');
        return;
      }

      setIsImageLoading(true);

      // 새로운 이미지와 기존 이미지 구분
      const newImages = selectedImages.filter((image) => !image.uri.startsWith('http'));
      const existingImages = selectedImages.filter((image) => image.uri.startsWith('http'));

      // 새 이미지만 업로드
      const uploadedUrls = await Promise.all(
        newImages.map(async (image) => {
          const extension = image.uri.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
          const { url } = await getPresignedUrlApi(fileName, image.type);
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await uploadFileToS3(url, blob);
          return url.split('?')[0];
        })
      );

      const updateData: UpdatePostDto = {
        title: title.trim() || undefined,
        content: content.trim(),
        type: selectedType,
        categoryId: selectedCategory,
        points: selectedType === 'QUESTION' ? parseInt(points, 10) || 0 : undefined,
        media: [
          ...existingImages.map((image) => ({
            media_id: post.media?.find((m) => m.media_url === image.uri)?.media_id,
            mediaUrl: image.uri,
            mediaType: 'IMAGE',
          })),
          ...uploadedUrls.map((url) => ({
            mediaUrl: url,
            mediaType: 'IMAGE',
          })),
        ],
      };

      console.log('updateData', JSON.stringify(updateData, null, 2));

      await updatePost.mutateAsync({
        postId: post.post_id,
        ...updateData,
      });

      // 데이터 업데이트가 반영될 시간을 주기
      await new Promise((resolve) => setTimeout(resolve, 100));

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.back();
    } catch (error) {
      console.error('Failed to update post:', error);
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Post Type Selection */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-600">Post Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {getAvailableTypes().map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 ${
                  selectedType === type ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                <Text className={selectedType === type ? 'text-white' : 'text-gray-700'}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Title Input - QUESTION 타입이거나 기존에 title이 있었던 경우 표시 */}
      {(selectedType === 'QUESTION' || post.post_content.title) && (
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Title</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-gray-50 p-3"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
        </View>
      )}

      {/* Content Input */}
      <View className="mb-4">
        <Text className="mb-2 text-gray-600">Content</Text>
        <TextInput
          className="h-32 rounded-lg border border-gray-300 bg-gray-50 p-3"
          value={content}
          onChangeText={setContent}
          placeholder="Enter content"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Topic Selection */}
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
                <Text className={selectedTopic === topic.topic_id ? 'text-white' : 'text-gray-700'}>
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Category Selection */}
      {selectedTopic && (
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {topics
                .find((t) => t.topic_id === selectedTopic)
                ?.category.map((category) => (
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

      {/* Points Input - QUESTION 타입일 때만 표시 */}
      {selectedType === 'QUESTION' && (
        <View className="mb-4">
          <Text className="mb-2 text-gray-600">Points</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-gray-50 p-3"
            value={points}
            onChangeText={setPoints}
            keyboardType="numeric"
            placeholder="Enter points"
          />
        </View>
      )}

      {/* Image Section */}
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
          <Text className="text-sm text-gray-600">
            {selectedImages.length}/{MAX_IMAGES}
          </Text>
        </View>

        {/* Image Preview */}
        <ScrollView horizontal className="mt-2">
          {selectedImages.map((image, index) => (
            <View key={index} className="mr-2">
              <View className="relative">
                <Image source={{ uri: image.uri }} className="h-20 w-20 rounded-lg" />
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

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="mt-4 rounded-lg bg-purple-500 p-4"
        disabled={updatePost.isPending}>
        <Text className="text-center font-bold text-white">
          {updatePost.isPending ? 'Updating...' : 'Update Post'}
        </Text>
      </TouchableOpacity>

      {/* Bottom Padding */}
      <View className="h-10" />
    </ScrollView>
  );
}
