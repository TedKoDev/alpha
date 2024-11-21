import { View, Text, Image } from 'react-native';

interface Comment {
  // 댓글 타입 정의
  id: number;
  content: string;
  created_at: string;
  user: {
    username: string;
    profile_image?: string;
  };
}

interface CommentSectionProps {
  comments?: Comment[];
}

export default function CommentSection({ comments = [] }: CommentSectionProps) {
  return (
    <View className="mt-4">
      <Text className="mb-4 text-lg font-bold">댓글</Text>

      {comments.length === 0 ? (
        <Text className="text-center text-gray-500">댓글이 없습니다.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} className="mb-4">
            <View className="flex-row items-start">
              <Image
                source={{
                  uri: comment.user?.profile_image || 'https://via.placeholder.com/32',
                }}
                className="h-8 w-8 rounded-full"
              />
              <View className="ml-2 flex-1">
                <View className="flex-row items-center">
                  <Text className="font-bold">{comment.user?.username}</Text>
                  <Text className="ml-2 text-xs text-gray-500">2시간 전</Text>
                </View>
                <Text className="mt-1 text-gray-800">{comment.content}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
