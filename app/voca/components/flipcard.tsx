import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const FlipCard = ({
  frontText,
  backText,
  detailRoute,
}: {
  frontText: string;
  backText: string;
  detailRoute: string;
}) => {
  const rotation = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const router = useRouter();

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value + 180}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const navigationDetail = () => {
    console.log('navigationDetail');
    router.push(detailRoute);
  };

  const handlePress = () => {
    const newRotation = isFlipped.value ? 0 : 180;
    rotation.value = withTiming(newRotation, { duration: 500 }, () => {
      runOnJS(navigationDetail)();
    });
    isFlipped.value = !isFlipped.value;
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <View style={styles.card}>
        <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
          <View style={styles.innerCard}>
            <Text style={styles.text}>{frontText}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.cardFace, styles.backCard, backAnimatedStyle]}>
          <View style={styles.innerCard}>
            <Text style={styles.text}>{backText}</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 80,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 10,
    backfaceVisibility: 'hidden',
  },
  innerCard: {
    width: '95%',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#008080',
  },
  backCard: {
    backgroundColor: '#FFD700',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

export default FlipCard;
