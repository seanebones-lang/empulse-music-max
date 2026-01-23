/**
 * Mood Controls Component
 * 
 * Displays mood sliders for energy, happiness, calmness, and intensity.
 * 
 * @module components/mood-controls
 */

'use client';

import { memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { MOOD_MIN, MOOD_MAX } from '@/lib/constants';
import { usePlayer } from '@/store/player-store';

/**
 * Mood Controls Component
 * 
 * @returns {JSX.Element} Mood controls UI
 */
export const MoodControls = memo(() => {
  const { mood, setMood } = usePlayer();

  return (
    <div className="space-y-4">
      <MoodSlider
        label="Energy"
        value={mood.energy}
        onChange={(value) => setMood({ energy: value })}
      />
      <MoodSlider
        label="Happiness"
        value={mood.happiness}
        onChange={(value) => setMood({ happiness: value })}
      />
      <MoodSlider
        label="Calmness"
        value={mood.calmness}
        onChange={(value) => setMood({ calmness: value })}
      />
      <MoodSlider
        label="Intensity"
        value={mood.intensity}
        onChange={(value) => setMood({ intensity: value })}
      />
    </div>
  );
});

MoodControls.displayName = 'MoodControls';

/**
 * Props for MoodSlider component
 */
interface MoodSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * Individual mood slider component
 * 
 * @param {MoodSliderProps} props - Component props
 * @returns {JSX.Element} Mood slider UI
 */
const MoodSlider = memo(({ label, value, onChange }: MoodSliderProps) => {
  const handleChange = (values: number[]) => onChange(values[0]);
  const sliderId = `mood-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${sliderId}-label`}>
      <label
        id={`${sliderId}-label`}
        htmlFor={sliderId}
        className="text-xs font-medium text-gray-300"
      >
        {label}
      </label>
      <Slider
        id={sliderId}
        value={[value]}
        onValueChange={handleChange}
        min={MOOD_MIN}
        max={MOOD_MAX}
        step={1}
        className="w-full focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
        aria-label={`${label} mood setting`}
        aria-valuemin={MOOD_MIN}
        aria-valuemax={MOOD_MAX}
        aria-valuenow={value}
        aria-valuetext={`${value} percent`}
      />
      <span className="text-xs text-gray-400" aria-live="polite" aria-atomic="true">
        {value}%
      </span>
    </div>
  );
});

MoodSlider.displayName = 'MoodSlider';
