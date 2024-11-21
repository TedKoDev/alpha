import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

interface CarouselItem {
  uri: string;
  title?: string;
  link?: string;
}

interface CustomCarouselProps {
  items: CarouselItem[];
  width?: number;
  height?: number;
  autoSlideInterval?: number;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  items,
  width,
  height,
  autoSlideInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  // //console.log('windowWidth:', windowWidth);

  const carouselWidth = width || windowWidth;
  const carouselHeight = height || 170;

  const handlePress = (item: CarouselItem) => {
    if (item.link) {
      if (item.link.startsWith('http')) {
        //console.log('Open URL:', item.link);
      } else {
        // navigation.navigate(item.link as never);
      }
    }
  };

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: carouselWidth, height: carouselHeight }}>
      <Carousel
        loop
        width={carouselWidth * 0.9}
        height={carouselHeight}
        autoPlay
        autoPlayInterval={autoSlideInterval}
        scrollAnimationDuration={1000}
        data={items}
        onSnapToItem={(index) => setCurrentIndex(index)} // Update current index
        renderItem={({ item }) => (
          <TapGestureHandler
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === 4) {
                // 4 is the 'end' state of the gesture (tap recognized)
                handlePress(item);
              }
            }}>
            <View className="items-center justify-center">
              <Image
                source={{ uri: item.uri }}
                className="h-full w-full rounded-none"
                style={{ resizeMode: 'cover' }} // resizeMode 속성은 NativeWind로 설정되지 않으므로 스타일로 설정
              />
            </View>
          </TapGestureHandler>
        )}
      />
      {/* 페이지 카운터 */}
      <View className="absolute bottom-3 right-6 rounded-full bg-[rgba(0,0,0,0.5)] px-3 py-1">
        <Text className="text-xs text-white">{`${currentIndex + 1} / ${items.length}`}</Text>
      </View>
    </View>
  );
};

export default CustomCarousel;
