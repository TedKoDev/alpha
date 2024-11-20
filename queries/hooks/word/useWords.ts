import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getWordApi } from '~/services/wordService';
import { useAuthStore } from '~/store/authStore';

export interface Word {
  word_id: number;
  word: string;
  meaning_en: string;
  example_sentence: string;
  example_translation: string;
  part_of_speech: string;
}

export function useWords() {
  const token = useAuthStore((state) => state.userToken);

  return useQuery<Word[], Error>({
    queryKey: ['todayWords'],
    queryFn: () => getWordApi(),
    enabled: !!token,
    onSuccess: (data: Word[]) => {
      console.log('API 응답:', data);
    },
    onError: (error: any) => {
      console.error('API 에러:', error);
    },
  } as UseQueryOptions<Word[], Error>);
}
