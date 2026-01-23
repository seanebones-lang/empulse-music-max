import { create } from 'zustand';

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
  duration: number;
};

interface PlayerState {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  crossfade: number;
  mood: {
    energy: number;
    happiness: number;
    calmness: number;
    intensity: number;
  };
  vibe: number;
  isPlayerExpanded: boolean;
  sidebarWidth: number;
  isSidebarCollapsed: boolean;
  setQueue: (queue: Track[]) => void;
  setCurrentIndex: (index: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setCrossfade: (crossfade: number) => void;
  setMood: (mood: Partial<PlayerState['mood']>) => void;
  setVibe: (vibe: number) => void;
  togglePlayerExpanded: () => void;
  setSidebarWidth: (width: number) => void;
  toggleSidebarCollapsed: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.8,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'none',
  crossfade: 2.0,
  mood: {
    energy: 50,
    happiness: 50,
    calmness: 50,
    intensity: 50,
  },
  vibe: 50,
  isPlayerExpanded: false,
  sidebarWidth: 280,
  isSidebarCollapsed: false,
  setQueue: (queue) => set({ queue }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
  setVolume: (volume) => set({ volume }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set({ shuffle: !get().shuffle }),
  toggleRepeat: () => {
    const current = get().repeat;
    const next = current === 'none' ? 'one' : current === 'one' ? 'all' : 'none';
    set({ repeat: next });
  },
  setCrossfade: (crossfade) => set({ crossfade }),
  setMood: (mood) => set({ mood: { ...get().mood, ...mood } }),
  setVibe: (vibe) => set({ vibe }),
  togglePlayerExpanded: () => set({ isPlayerExpanded: !get().isPlayerExpanded }),
  setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(400, width)) }),
  toggleSidebarCollapsed: () => set({ isSidebarCollapsed: !get().isSidebarCollapsed }),
  handleNext: () => {
    const { currentIndex, queue, shuffle, repeat } = get();
    
    // Edge case: Empty queue
    if (!queue || queue.length === 0) {
      return;
    }
    
    let nextIdx = currentIndex + 1;
    if (shuffle) {
      // Edge case: Prevent division by zero
      nextIdx = queue.length > 0 ? Math.floor(Math.random() * queue.length) : 0;
    }
    if (nextIdx >= queue.length) {
      nextIdx = repeat === 'all' ? 0 : currentIndex;
    }
    set({ currentIndex: nextIdx });
  },
  handlePrevious: () => {
    const { currentIndex, queue, shuffle, repeat } = get();
    
    // Edge case: Empty queue
    if (!queue || queue.length === 0) {
      return;
    }
    
    let prevIdx = currentIndex - 1;
    if (shuffle) {
      // Edge case: Prevent division by zero
      prevIdx = queue.length > 0 ? Math.floor(Math.random() * queue.length) : 0;
    }
    if (prevIdx < 0) {
      prevIdx = repeat === 'all' ? queue.length - 1 : 0;
    }
    set({ currentIndex: prevIdx });
  },
}));
