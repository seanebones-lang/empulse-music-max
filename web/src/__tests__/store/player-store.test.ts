import { renderHook, act } from '@testing-library/react'
import { usePlayer, type Track } from '@/store/player-store'

describe('Player Store', () => {
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Track 1',
      artist: 'Artist 1',
      url: 'https://example.com/track1.mp3',
      artwork: 'https://example.com/artwork1.jpg',
      duration: 180,
    },
    {
      id: '2',
      title: 'Track 2',
      artist: 'Artist 2',
      url: 'https://example.com/track2.mp3',
      artwork: 'https://example.com/artwork2.jpg',
      duration: 200,
    },
    {
      id: '3',
      title: 'Track 3',
      artist: 'Artist 3',
      url: 'https://example.com/track3.mp3',
      artwork: 'https://example.com/artwork3.jpg',
      duration: 220,
    },
  ]

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => usePlayer())
    act(() => {
      result.current.setQueue([])
      result.current.setCurrentIndex(0)
      // Ensure isPlaying is false
      if (result.current.isPlaying) {
        result.current.togglePlay()
      }
      result.current.setVolume(0.8)
      result.current.setPosition(0)
      result.current.setDuration(0)
      if (result.current.shuffle) {
        result.current.toggleShuffle()
      }
      while (result.current.repeat !== 'none') {
        result.current.toggleRepeat()
      }
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.queue).toEqual([])
      expect(result.current.currentIndex).toBe(0)
      expect(result.current.isPlaying).toBe(false)
      expect(result.current.volume).toBe(0.8)
      expect(result.current.shuffle).toBe(false)
      expect(result.current.repeat).toBe('none')
      expect(result.current.mood).toEqual({
        energy: 50,
        happiness: 50,
        calmness: 50,
        intensity: 50,
      })
    })
  })

  describe('Queue Management', () => {
    it('should set queue correctly', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
      })

      expect(result.current.queue).toEqual(mockTracks)
      expect(result.current.queue.length).toBe(3)
    })

    it('should set current index', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(1)
      })

      expect(result.current.currentIndex).toBe(1)
    })
  })

  describe('Playback Controls', () => {
    it('should toggle play state', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.isPlaying).toBe(false)

      act(() => {
        result.current.togglePlay()
      })

      expect(result.current.isPlaying).toBe(true)

      act(() => {
        result.current.togglePlay()
      })

      expect(result.current.isPlaying).toBe(false)
    })

    it('should set volume', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setVolume(0.5)
      })

      expect(result.current.volume).toBe(0.5)
    })

    it('should set position', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setPosition(45.5)
      })

      expect(result.current.position).toBe(45.5)
    })

    it('should set duration', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setDuration(180)
      })

      expect(result.current.duration).toBe(180)
    })
  })

  describe('Shuffle and Repeat', () => {
    it('should toggle shuffle', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.shuffle).toBe(false)

      act(() => {
        result.current.toggleShuffle()
      })

      expect(result.current.shuffle).toBe(true)

      act(() => {
        result.current.toggleShuffle()
      })

      expect(result.current.shuffle).toBe(false)
    })

    it('should cycle through repeat modes', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.repeat).toBe('none')

      act(() => {
        result.current.toggleRepeat()
      })
      expect(result.current.repeat).toBe('one')

      act(() => {
        result.current.toggleRepeat()
      })
      expect(result.current.repeat).toBe('all')

      act(() => {
        result.current.toggleRepeat()
      })
      expect(result.current.repeat).toBe('none')
    })
  })

  describe('Navigation (handleNext)', () => {
    it('should move to next track', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(0)
        result.current.handleNext()
      })

      expect(result.current.currentIndex).toBe(1)
    })

    it('should wrap to beginning when repeat is "all"', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(2) // Last track
        result.current.toggleRepeat() // Set to 'one'
        result.current.toggleRepeat() // Set to 'all'
        result.current.handleNext()
      })

      expect(result.current.currentIndex).toBe(0)
    })

    it('should stay on current track when at end and repeat is "none"', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(2) // Last track
        result.current.handleNext()
      })

      expect(result.current.currentIndex).toBe(2) // Should stay on last track
    })

    it('should handle empty queue gracefully', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue([])
        result.current.setCurrentIndex(0)
        result.current.handleNext()
      })

      expect(result.current.currentIndex).toBe(0)
    })

    it('should use random index when shuffle is enabled', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(0)
        result.current.toggleShuffle()
        result.current.handleNext()
      })

      // Should be a valid index (0, 1, or 2)
      expect(result.current.currentIndex).toBeGreaterThanOrEqual(0)
      expect(result.current.currentIndex).toBeLessThan(3)
    })
  })

  describe('Navigation (handlePrevious)', () => {
    it('should move to previous track', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(2)
        result.current.handlePrevious()
      })

      expect(result.current.currentIndex).toBe(1)
    })

    it('should wrap to end when repeat is "all"', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(0) // First track
        result.current.toggleRepeat() // Set to 'one'
        result.current.toggleRepeat() // Set to 'all'
        result.current.handlePrevious()
      })

      expect(result.current.currentIndex).toBe(2) // Should wrap to last track
    })

    it('should stay on first track when at beginning and repeat is "none"', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(0)
        result.current.handlePrevious()
      })

      expect(result.current.currentIndex).toBe(0) // Should stay on first track
    })

    it('should handle empty queue gracefully', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue([])
        result.current.setCurrentIndex(0)
        result.current.handlePrevious()
      })

      expect(result.current.currentIndex).toBe(0)
    })

    it('should use random index when shuffle is enabled', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setQueue(mockTracks)
        result.current.setCurrentIndex(2)
        result.current.toggleShuffle()
        result.current.handlePrevious()
      })

      // Should be a valid index (0, 1, or 2)
      expect(result.current.currentIndex).toBeGreaterThanOrEqual(0)
      expect(result.current.currentIndex).toBeLessThan(3)
    })
  })

  describe('Mood and Vibe', () => {
    it('should update mood', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setMood({ energy: 75, happiness: 80 })
      })

      expect(result.current.mood.energy).toBe(75)
      expect(result.current.mood.happiness).toBe(80)
      expect(result.current.mood.calmness).toBe(50) // Should keep default
      expect(result.current.mood.intensity).toBe(50) // Should keep default
    })

    it('should set vibe', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setVibe(75)
      })

      expect(result.current.vibe).toBe(75)
    })
  })

  describe('UI State', () => {
    it('should toggle player expanded state', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.isPlayerExpanded).toBe(false)

      act(() => {
        result.current.togglePlayerExpanded()
      })

      expect(result.current.isPlayerExpanded).toBe(true)
    })

    it('should set sidebar width within bounds', () => {
      const { result } = renderHook(() => usePlayer())

      act(() => {
        result.current.setSidebarWidth(300)
      })

      expect(result.current.sidebarWidth).toBe(300)

      // Should clamp to max
      act(() => {
        result.current.setSidebarWidth(500)
      })

      expect(result.current.sidebarWidth).toBe(400)

      // Should clamp to min
      act(() => {
        result.current.setSidebarWidth(100)
      })

      expect(result.current.sidebarWidth).toBe(200)
    })

    it('should toggle sidebar collapsed state', () => {
      const { result } = renderHook(() => usePlayer())

      expect(result.current.isSidebarCollapsed).toBe(false)

      act(() => {
        result.current.toggleSidebarCollapsed()
      })

      expect(result.current.isSidebarCollapsed).toBe(true)
    })
  })
})
