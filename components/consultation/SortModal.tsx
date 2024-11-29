import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';

interface SortModalProps {
  visible: boolean;
  selectedSort: 'latest' | 'oldest';
  onSelect: (sort: 'latest' | 'oldest') => void;
  onClose: () => void;
}

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' as const },
  { label: '오래된순', value: 'oldest' as const },
] as const;

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  selectedSort,
  onSelect,
  onClose,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="absolute bottom-0 w-full bg-white">
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="border-b border-gray-200 p-4"
              onPress={() => onSelect(option.value)}>
              <Text
                className={`text-center text-lg ${
                  selectedSort === option.value ? 'font-bold text-purple-500' : 'text-gray-700'
                }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity className="p-4" onPress={onClose}>
            <Text className="text-center text-lg text-gray-500">취소</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};
