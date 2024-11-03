import { create } from 'zustand';
import { getWordApi } from '../services/wordService';

interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface WordStore {
  todayWords: Word[];
  isLoading: boolean;
  fetchTodayWords: () => Promise<void>;
}

export const useWordStore = create<WordStore>((set) => ({
  todayWords: [],
  isLoading: false,
  fetchTodayWords: async () => {
    try {
      set({ isLoading: true });
      const words = await getWordApi();
      set({ todayWords: words });
    } catch (error) {
      console.error('Failed to fetch today words:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
