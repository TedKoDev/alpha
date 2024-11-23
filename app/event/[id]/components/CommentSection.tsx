import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { View, Text, Image } from 'react-native';
import 'dayjs/locale/ko';

import CommentInput from './CommentInput';

dayjs.extend(relativeTime);
dayjs.locale('en');

interface CommentSectionProps {
  postId: number;
  comments: {
    comment_id: number;
    content: string;
    created_at: string;
    user: {
      username: string;
      profile_picture_url: string;
    };
  }[];
}

export default function CommentSection({ postId, comments = [] }: CommentSectionProps) {
  return (
    <View className="flex-1">
      <View className="mt-4 flex-1">
        <Text className="mb-4 text-lg font-bold">Comments ({comments.length})</Text>

        {comments.length === 0 ? (
          <Text className="text-center text-gray-500">No comments yet.</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.comment_id} className="mb-4">
              <View className="flex-row items-start">
                <Image
                  source={{
                    uri: comment.user?.profile_picture_url || 'https://via.placeholder.com/32',
                  }}
                  className="h-8 w-8 rounded-full"
                />
                <View className="ml-2 flex-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="font-bold">{comment.user?.username}</Text>
                      <Text className="ml-2 text-xs text-gray-500">
                        {dayjs(comment.created_at).fromNow()}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-1 text-gray-800">{comment.content}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <CommentInput postId={postId} />
    </View>
  );
}
