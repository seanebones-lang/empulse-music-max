import { useEffect } from 'react';
import { usePlayer } from '@/store/player-store';

/**
 * Keyboard shortcuts hook for player controls
 * Space: Play/Pause
 * Arrow Left: Previous track
 * Arrow Right: Next track
 * Arrow Up: Increase volume
 * Arrow Down: Decrease volume
 * M: Mute/Unmute
 * S: Shuffle toggle
 * R: Repeat toggle
 */
export function useKeyboardShortcuts() {
  const {
    togglePlay,
    handleNext,
    handlePrevious,
    volume,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Prevent default for shortcuts
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 0.8);
          break;
        case 'KeyS':
          e.preventDefault();
          toggleShuffle();
          break;
        case 'KeyR':
          e.preventDefault();
          toggleRepeat();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleNext, handlePrevious, volume, setVolume, toggleShuffle, toggleRepeat]);
}
