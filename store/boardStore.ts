import { create } from 'zustand';

interface BoardState {
  cachedPosts: {
    bella: any[];
    notice: any[];
    hot: any[];
  };
  setCachedPosts: (type: 'bella' | 'notice' | 'hot', posts: any[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  cachedPosts: {
    bella: [],
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
