import { create } from 'zustand';

interface BoardState {
  cachedPosts: {
    Bera: any[];
    notice: any[];
    hot: any[];
  };
  setCachedPosts: (type: 'Bera' | 'notice' | 'hot', posts: any[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  cachedPosts: {
    Bera: [],
    notice: [],
    hot: [],
  },
  setCachedPosts: (type, posts) =>
    set((state) => ({
      cachedPosts: {
        ...state.cachedPosts,
        [type]: posts,
      },
    })),
}));
