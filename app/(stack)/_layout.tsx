import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function StackLayout() {
  const router = useRouter();

  const handlePress = () => {
    console.log('write button pressed');
    router.push('/write/with-words');
  };

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      handlePress();
    });

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#B227D4',
        headerRight: () => (
          <View
            style={{
              position: 'absolute',
              right: 0,
              paddingRight: 16,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 999,
              elevation: 2,
            }}>
            <GestureDetector gesture={tap}>
              <View
                style={{
                  padding: 8,
                }}>
                <Feather name="edit" size={24} color="#B227D4" />
              </View>
            </GestureDetector>
          </View>
        ),
      }}
    />
  );
}
