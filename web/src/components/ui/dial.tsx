'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  className?: string;
  label?: string;
}

export function Dial({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 120,
  className,
  label,
}: DialProps) {
  const dialRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const gradientId = React.useMemo(() => `dialGradient-${Math.random().toString(36).substring(2, 11)}`, []);

  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 360 - 90; // Start from top

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !dialRef.current) return;
    handleMove(e);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMove = (e: MouseEvent | React.MouseEvent) => {
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY || 0;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Normalize to 0-360, starting from top

    const newValue = Math.round((angle / 360) * (max - min) + min);
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  React.useEffect(() => {
    if (isDragging.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove as any);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove as any);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging.current]);

  const radius = size / 2 - 10;
  const indicatorX = radius * Math.cos((angle * Math.PI) / 180);
  const indicatorY = radius * Math.sin((angle * Math.PI) / 180);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {label && (
        <span className="text-xs font-medium text-gray-300">{label}</span>
      )}
      <div
        ref={dialRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          isDragging.current = true;
          handleMove(e.nativeEvent as any);
        }}
      >
        {/* Outer ring */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center circle */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg"
          style={{
            width: size * 0.4,
            height: size * 0.4,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Math.round(value)}
        </div>

        {/* Indicator */}
        <div
          className="absolute w-3 h-3 rounded-full bg-white shadow-lg border-2 border-purple-500"
          style={{
            left: `calc(50% + ${indicatorX}px)`,
            top: `calc(50% + ${indicatorY}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}
