# 📘 Type Definitions Documentation
## EmPulse Music Max - TypeScript Type Reference

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Overview

This document provides comprehensive documentation for all TypeScript types and interfaces used in the EmPulse Music Max application.

---

## Core Types

### Track

Represents a music track.

**Location:** `src/store/player-store.ts`

```typescript
export type Track = {
  id: string;           // Unique track identifier
  title: string;        // Track title
  artist: string;       // Artist name
  url: string;          // Audio file URL
  artwork: string;      // Album/track artwork URL
  duration: number;     // Duration in seconds
};
```

**Example:**

```typescript
const track: Track = {
  id: '1',
  title: 'EmPulse Beat 1',
  artist: 'RE Artist',
  url: 'https://example.com/track.mp3',
  artwork: 'https://example.com/artwork.jpg',
  duration: 210,
};
```

---

### ContentType

Type of content item.

**Location:** `src/types/content.ts`

```typescript
export type ContentType = 
  | 'genre' 
  | 'feature' 
  | 'artist' 
  | 'playlist' 
  | 'album' 
  | 'track';
```

**Usage:**

```typescript
const contentType: ContentType = 'playlist';
```

---

### ContentCard

Represents a content card (track, artist, playlist, etc.).

**Location:** `src/types/content.ts`

```typescript
export type ContentCard = {
  id: string;                    // Unique identifier
  type: ContentType;              // Content type
  title: string;                  // Display title
  subtitle?: string;              // Optional subtitle
  image: string;                  // Image URL
  description?: string;           // Optional description
  items?: ContentCard[];          // Nested items (for genres/features)
  tracks?: Track[];               // Associated tracks (for playlists/albums)
  metadata?: {                    // Optional metadata
    trackCount?: number;
    duration?: number;
    priority?: string;
    status?: string;
    effort?: string;
    [key: string]: string | number | undefined;
  };
};
```

**Example:**

```typescript
const playlistCard: ContentCard = {
  id: 'playlist-1',
  type: 'playlist',
  title: 'My Playlist',
  subtitle: 'A great collection',
  image: 'https://example.com/playlist.jpg',
  tracks: [track1, track2, track3],
  metadata: {
    trackCount: 3,
  },
};
```

---

### Section

Represents a content section on the home page.

**Location:** `src/types/content.ts`

```typescript
export type Section = {
  id: string;                    // Unique section identifier
  title: string;                  // Section title
  type: 'feature' | 'genre' | 'custom';  // Section type
  items: ContentCard[];           // Content cards in section
  showAllLink?: string;           // Optional "Show all" link
};
```

**Example:**

```typescript
const section: Section = {
  id: 'featured',
  title: 'Featured',
  type: 'custom',
  items: [card1, card2, card3],
  showAllLink: '/featured',
};
```

---

## Store Types

### PlayerState

Complete player state interface.

**Location:** `src/store/player-store.ts`

```typescript
interface PlayerState {
  // Queue Management
  queue: Track[];
  currentIndex: number;

  // Playback State
  isPlaying: boolean;
  volume: number;        // 0.0 to 1.0
  position: number;      // Current position in seconds
  duration: number;      // Total duration in seconds

  // Playback Controls
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  crossfade: number;     // Crossfade duration in seconds

  // Mood Controls
  mood: {
    energy: number;      // 0-100
    happiness: number;   // 0-100
    calmness: number;    // 0-100
    intensity: number;    // 0-100
  };
  vibe: number;          // 0-100

  // UI State
  isPlayerExpanded: boolean;
  sidebarWidth: number;  // 200-400px
  isSidebarCollapsed: boolean;

  // Actions
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
```

**Usage:**

```typescript
const { queue, isPlaying, togglePlay } = usePlayer();
```

---

## Component Props Types

### ContentCardProps

Props for ContentCard component.

**Location:** `src/components/content-card.tsx`

```typescript
interface ContentCardProps {
  card: ContentCardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### ContentSectionProps

Props for ContentSection component.

**Location:** `src/components/content-section.tsx`

```typescript
interface ContentSectionProps {
  section: Section;
  onCardClick?: (card: ContentCardType) => void;
}
```

---

### AudioEngineProps

Props for AudioEngine component.

**Location:** `src/components/audio-engine.tsx`

```typescript
interface AudioEngineProps {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}
```

---

## API Types

### API Response Types

**Tracks API Response:**

```typescript
type TracksResponse = Track[];
```

**Sections API Response:**

```typescript
type SectionsResponse = Section[];
```

**Error Response:**

```typescript
type ErrorResponse = {
  error: string;
};
```

---

## Utility Types

### ClassValue

Type for className values (from clsx).

**Location:** `src/lib/utils.ts`

```typescript
import { type ClassValue } from "clsx";
```

**Usage:**

```typescript
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## Constants Types

### MoodRange

Mood slider value range.

**Location:** `src/lib/constants.ts`

```typescript
export const MOOD_MIN = 0;
export const MOOD_MAX = 100;

// Type for mood values
type MoodValue = number; // 0-100
```

---

## Type Guards

### Type Checking Functions

```typescript
// Check if value is a Track
function isTrack(value: unknown): value is Track {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'artist' in value &&
    'url' in value &&
    'artwork' in value &&
    'duration' in value
  );
}

// Check if value is a ContentCard
function isContentCard(value: unknown): value is ContentCard {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'title' in value &&
    'image' in value
  );
}
```

---

## Type Utilities

### Partial

Make all properties optional.

```typescript
type PartialTrack = Partial<Track>;
// All properties are optional
```

### Pick

Select specific properties.

```typescript
type TrackSummary = Pick<Track, 'id' | 'title' | 'artist'>;
// Only id, title, and artist
```

### Omit

Exclude specific properties.

```typescript
type TrackWithoutDuration = Omit<Track, 'duration'>;
// All properties except duration
```

### Record

Create object type with specific keys.

```typescript
type TrackMap = Record<string, Track>;
// { [key: string]: Track }
```

---

## Best Practices

### 1. Use Interfaces for Objects

```typescript
// Good
interface User {
  id: string;
  name: string;
}

// Avoid
type User = {
  id: string;
  name: string;
};
```

### 2. Use Types for Unions

```typescript
// Good
type Status = 'pending' | 'approved' | 'rejected';

// Avoid
interface Status {
  value: 'pending' | 'approved' | 'rejected';
}
```

### 3. Export Types

```typescript
// Export for reuse
export type Track = { ... };
export interface PlayerState { ... };
```

### 4. Use Type Guards

```typescript
// Type-safe checking
if (isTrack(value)) {
  // value is Track here
  console.log(value.title);
}
```

### 5. Avoid `any`

```typescript
// Bad
function process(data: any) { ... }

// Good
function process(data: Track | ContentCard) { ... }

// Or use unknown
function process(data: unknown) {
  if (isTrack(data)) {
    // Type-safe
  }
}
```

---

## Type Definitions Location

| Type | Location |
|------|----------|
| `Track` | `src/store/player-store.ts` |
| `ContentCard` | `src/types/content.ts` |
| `Section` | `src/types/content.ts` |
| `ContentType` | `src/types/content.ts` |
| `PlayerState` | `src/store/player-store.ts` |
| Component Props | Component files |
| API Types | API route files |

---

## Type Checking

### Compile-Time Checking

```bash
# Check types without building
npx tsc --noEmit

# Check types in watch mode
npx tsc --noEmit --watch
```

### IDE Support

- VS Code TypeScript extension
- Type hints on hover
- Auto-completion
- Error highlighting

---

## Common Type Patterns

### Optional Properties

```typescript
interface Config {
  required: string;
  optional?: string;  // Optional
}
```

### Readonly Properties

```typescript
interface Config {
  readonly id: string;  // Cannot be modified
  name: string;
}
```

### Index Signatures

```typescript
interface Metadata {
  [key: string]: string | number | undefined;
}
```

### Generic Types

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}

type TrackResponse = ApiResponse<Track>;
```

---

**For more information, see:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
