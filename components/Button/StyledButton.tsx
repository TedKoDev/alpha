import React from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';

interface StyledButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  color?: string;
  pressedColor?: string;
}

export default function StyledButton({
  onPress,
  style,
  textStyle,
  children,
  color = '#36AFFF',
  pressedColor = '#007ACC',
}: StyledButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? pressedColor : color },
        pressed ? styles.buttonPressed : styles.buttonNormal,
        style,
      ]}
      onPress={onPress}>
      {typeof children === 'string' ? (
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonNormal: {
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
