/**
 * Player Controls Component
 * 
 * Displays the main audio player controls including play/pause, skip, shuffle, repeat, and volume.
 * 
 * @module components/player-controls
 */

'use client';

import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Mic2,
} from 'lucide-react';

/**
 * Props for PlayerControls component
 */
interface PlayerControlsProps {
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  isVoiceActive: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleVoice: () => void;
}

/**
 * Player Controls Component
 * 
 * @param {PlayerControlsProps} props - Component props
 * @returns {JSX.Element} Player controls UI
 */
export const PlayerControls = memo(({
  isPlaying,
  volume,
  shuffle,
  repeat,
  isVoiceActive,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleVoice,
}: PlayerControlsProps) => {
  const handleVolumeChange = useCallback(
    ([v]: number[]) => onVolumeChange(v / 100),
    [onVolumeChange]
  );

  return (
    <div
      id="player-controls"
      className="flex items-center gap-3 flex-wrap"
      role="toolbar"
      aria-label="Player controls"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleShuffle}
        className={`text-white hover:bg-white/10 ${shuffle ? 'bg-purple-600/30' : ''}`}
        aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
      >
        <Shuffle className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className="text-white hover:bg-white/10"
        aria-label="Previous track"
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      <Button
        variant="default"
        size="icon"
        onClick={onPlayPause}
        className="bg-purple-600 hover:bg-purple-700 text-white h-12 w-12 rounded-full"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="text-white hover:bg-white/10"
        aria-label="Next track"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleRepeat}
        className={`text-white hover:bg-white/10 ${repeat !== 'none' ? 'bg-purple-600/30' : ''}`}
        aria-label={`Repeat: ${repeat === 'one' ? 'Repeat one' : repeat === 'all' ? 'Repeat all' : 'Repeat off'}`}
      >
        <Repeat className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleVoice}
        className={`text-white hover:bg-white/10 ${isVoiceActive ? 'bg-purple-600/30' : ''}`}
        aria-label={isVoiceActive ? 'Disable voice control' : 'Enable voice control'}
      >
        <Mic2 className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2" role="group" aria-label="Volume control">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={[volume * 100]}
          onValueChange={handleVolumeChange}
          min={0}
          max={100}
          step={1}
          className="w-24"
          aria-label="Volume"
        />
      </div>
    </div>
  );
});

PlayerControls.displayName = 'PlayerControls';
