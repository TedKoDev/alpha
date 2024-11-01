import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { AngleRiget, FlameIcon } from '~/assets/icons';
import AngleRightIcon from '~/assets/icons/AnglerightIcon';
import GrayLine from '../grayline';
import { ResizeMode, Video } from 'expo-av';
import { useAuthStore } from '~/store/authStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LessonCard({ onMorePress, participationCount = 0, points = 0 }: any) {
  const { userInfo } = useAuthStore(); // userInfo 가져오기

  const words = ['사랑', '행복', '기쁨']; // 예시 단어들
  const sentences = ['나는 사랑을 느껴요', '행복한 하루를 보내요', '기쁨이 가득한 날이에요']; // 예시 문장들
  const participantCount = 128; // 참여한 사람 수

  return (
    <View className="rounded-lg bg-white p-5">
      <View className="mb-4 flex-row items-center">
        {/* 불꽃 아이콘 삽입 */}
        {/* <FlameIcon width={40} height={40} />
         */}

        {/* 프로필 이미지 삽입 */}
        {userInfo?.profile_picture_url ? (
          <Image
            source={{ uri: userInfo.profile_picture_url }}
            style={{ width: 50, height: 50, borderRadius: 25 }} // 원형 이미지
          />
        ) : (
          <FontAwesome name="user-circle" size={50} color="#B227D4" /> // FontAwesome 기본 아바타
        )}

        {/* <Video
          source={require('../../assets/flare.mp4')}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={{ width: 60, height: 60 }}
        /> */}

        {/* 참여 횟수, 내가 쓴 문장 보러가기, 보유 포인트 */}
        <View className="ml-4 flex-1 flex-row  justify-between ">
          <View className="mr-5">
            <Text className="text-base font-bold text-gray-800">
              참여 횟수: {participationCount}회
            </Text>
            <TouchableOpacity onPress={onMorePress} className="flex-row items-center">
              <Text className="text-sm text-[#B227D4]">See my works</Text>
              <View className="ml-2 mt-0.5">
                <AngleRightIcon width={10} height={10} color="#B227D4" />
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex bg-white">
            <Text className="text-lg text-black  ">Points : {userInfo.points} P</Text>
          </View>
        </View>
      </View>

      <View className="mb-4 rounded-lg bg-[#B227D4]/80 p-4">
        <View className="mb-3 flex-row justify-between">
          <Text className="text-lg font-bold text-white">Today's Words</Text>
          <Text className="text-sm text-white">Joined: {participantCount} Users</Text>
        </View>

        {/* 한국어 단어 3가지를 가로로 배치 */}
        {/* 한국어 단어 3가지를 가로로 배치 */}
        <View className="mb-4 flex-row space-x-4">
          {words.map((word, index) => (
            <View
              key={index}
              className={`flex-1 items-center justify-center rounded-md bg-white/90 p-3 ${
                index !== words.length - 1 ? 'mr-2' : 'mr-0' // 마지막 요소에는 mr-0 적용
              }`}>
              <Text className="text-lg font-bold text-[#B227D4]">{word}</Text>
            </View>
          ))}
        </View>

        {/* 최근 참여한 사람의 문장 3개 */}
        <View className="mb-3 rounded-md bg-white/90 p-3">
          {sentences.map((sentence, index) => (
            <Text key={index} className="mb-2 text-sm text-[#B227D4]">
              {sentence}
            </Text>
          ))}

          <GrayLine thickness={1} marginTop={5} marginBottom={5} />
          {/* 더보기 터치 가능 */}
          <TouchableOpacity onPress={onMorePress}>
            <Text className="text-center font-bold text-[#B227D4]">더보기 . . .</Text>
          </TouchableOpacity>
        </View>

        {/* 참여하기 버튼 */}
        <TouchableOpacity className="items-center justify-center rounded-md bg-white py-3">
          <Text className="text-lg font-bold text-[#B227D4]">참여하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
