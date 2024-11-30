import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answerConsultationApi } from '~/services/commentService';

export function useAnswerConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
      commentId,
    }: {
      postId: number;
      content: string;
      commentId: number;
    }) => answerConsultationApi(postId, content, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultation', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
