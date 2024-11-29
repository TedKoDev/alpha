import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useConsultationById } from '~/queries/hooks/posts/useConsultations';
import { useUpdatePost } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';
import { getStatusColor, getStatusText } from '~/types/consultation';

export default function EditConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: consultation, isLoading } = useConsultationById(Number(id));

  console.log('consultation', JSON.stringify(consultation, null, 2));

  const updatePost = useUpdatePost();
  const { data: topics = [] } = useTopics();

  const { data: userInfo } = useUserInfo();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string }[]>([]);

  const MAX_IMAGES = 5;

  useEffect(() => {
    if (consultation) {
      setTitle(consultation.post_content.title);
      setContent(consultation.post_content.content);
      setSelectedCategory(consultation.category_id);
      if (consultation.post_content.images) {
        setSelectedImages(
          consultation.post_content.images.map((image) => ({
            uri: image.url,
            type: 'image/jpeg',
          }))
        );
      }
    }
  }, [consultation]);

  const consultationCategories = topics.find((topic) => topic.topic_id === 1)?.category || [];

  console.log('consultationCategories', consultationCategories);

  const pickImages = async () => {
    try {
      if (selectedImages.length >= MAX_IMAGES) {
        Alert.alert('알림', '최대 5개의 이미지만 업로드할 수 있습니다.');
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
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지 선택에 실패했습니다.');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      // 이미지 업로드 처리
      const uploadedImages = [];
      for (const image of selectedImages) {
        if (!image.uri.startsWith('http')) {
          const presignedData = await getPresignedUrlApi(image.type);
          await uploadFileToS3(presignedData.presigned_url, image.uri, image.type);
          uploadedImages.push({ url: presignedData.image_url });
        } else {
          uploadedImages.push({ url: image.uri });
        }
      }

      await updatePost.mutateAsync({
        postId: Number(id),
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategory!,
        images: uploadedImages,
      });
      router.back();
    } catch (error) {
      Alert.alert('오류', '수정에 실패했습니다.');
    }
  };

  // 선택된 카테고리의 기본 가격 가져오기
  const selectedCategoryPrice =
    consultationCategories.find((cat) => cat.category_id === selectedCategory)?.base_price || 0;

  // 포인트가 충분한지 확인
  const hasEnoughPoints = (userInfo?.points || 0) >= selectedCategoryPrice;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B227D4" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '상담 수정',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white p-4">
        {/* 카테고리 ��택 */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-bold">상담 유형</Text>
            <Text className="text-sm text-gray-500">
              현재 선택:{' '}
              {
                consultationCategories.find((cat) => cat.category_id === selectedCategory)
                  ?.category_name
              }
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {consultationCategories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                onPress={() => setSelectedCategory(category.category_id)}
                className={`mr-2 rounded-full border px-4 py-2 ${
                  selectedCategory === category.category_id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300'
                }`}>
                <View className="flex-row items-center">
                  {selectedCategory === category.category_id && (
                    <Ionicons name="checkmark-circle" size={16} color="#B227D4" className="mr-1" />
                  )}
                  <Text
                    className={
                      selectedCategory === category.category_id
                        ? 'text-purple-500'
                        : 'text-gray-600'
                    }>
                    {category.category_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 상담 상태 표시 */}
        <View className="mb-4">
          <Text className="mb-2 text-base font-bold">상담 상태</Text>
          <View className={`rounded-lg p-3 ${getStatusColor(consultation?.post_content.status)}`}>
            <Text className="text-center font-medium">
              {getStatusText(consultation?.post_content.status)}
            </Text>
          </View>
        </View>

        {/* 가격 및 포인트 정보 */}
        <View className="mb-4 rounded-lg bg-gray-100 p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-gray-600">상담 비용</Text>
            <Text className="text-lg font-bold text-purple-500">{selectedCategoryPrice} P</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">보유 포인트</Text>
            <Text
              className={`text-lg font-bold ${hasEnoughPoints ? 'text-green-500' : 'text-red-500'}`}>
              {userInfo?.points || 0} P
            </Text>
          </View>
          {!hasEnoughPoints && (
            <Text className="mt-2 text-sm text-red-500">
              포인트가 부족합니다. 충전 후 이용해주세요.
            </Text>
          )}
        </View>

        {/* 제목 입력 */}
        <TextInput
          className="mb-4 rounded-lg border border-gray-300 p-3"
          placeholder="제목을 입력하세요"
          value={title}
          onChangeText={setTitle}
        />

        {/* 내용 입력 */}
        <TextInput
          className="mb-4 h-40 rounded-lg border border-gray-300 p-3"
          placeholder="상담 내용을 자세히 작성해주세요"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* 이미지 첨부 */}
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
              <Text className="ml-2">{isImageLoading ? '이미지 로딩중...' : '이미지 추가'}</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">
              {selectedImages.length}/{MAX_IMAGES}
            </Text>
          </View>

          {/* 이미지 미리보기 */}
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

        {/* 수정 버튼 */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg bg-purple-500 p-4"
          disabled={updatePost.isPending}>
          <Text className="text-center font-bold text-white">
            {updatePost.isPending ? '수정 중...' : '수정하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
