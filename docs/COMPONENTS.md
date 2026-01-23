# 🧩 Component Documentation
## EmPulse Music Max - Component Reference

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Overview

This document provides comprehensive documentation for all React components in the EmPulse Music Max application.

---

## Core Components

### ContentCard

A reusable card component for displaying content items (tracks, artists, playlists, genres, features).

**Location:** `src/components/content-card.tsx`

**Props:**

```typescript
interface ContentCardProps {
  card: ContentCardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}
```

**Example:**

```tsx
import { ContentCard } from '@/components/content-card';

<ContentCard
  card={{
    id: 'track-1',
    type: 'track',
    title: 'Song Title',
    subtitle: 'Artist Name',
    image: 'https://example.com/artwork.jpg',
    metadata: { trackCount: 10 }
  }}
  onClick={() => console.log('Card clicked')}
  size="md"
/>
```

**Features:**
- Memoized for performance
- Hover animations with Framer Motion
- Icon mapping for different content types
- Responsive image loading with Next.js Image
- Track count display

**Content Types Supported:**
- `track` - Music tracks
- `artist` - Artist profiles
- `playlist` - Playlists
- `album` - Albums
- `genre` - Music genres
- `feature` - Feature cards

---

### ContentSection

Displays a horizontal scrolling section of content cards.

**Location:** `src/components/content-section.tsx`

**Props:**

```typescript
interface ContentSectionProps {
  section: Section;
  onCardClick?: (card: ContentCardType) => void;
}
```

**Example:**

```tsx
import { ContentSection } from '@/components/content-section';

<ContentSection
  section={{
    id: 'featured',
    title: 'Featured',
    type: 'feature',
    items: [/* content cards */],
    showAllLink: '/featured'
  }}
  onCardClick={(card) => handleCardClick(card)}
/>
```

**Features:**
- Horizontal scrolling container
- Staggered animations for cards
- "Show all" button (conditional)
- Memoized for performance
- Responsive design

---

### Sidebar

Main navigation sidebar with collapsible sections.

**Location:** `src/components/sidebar.tsx`

**Props:** None (uses Zustand store for state)

**Features:**
- Resizable width (200-400px)
- Collapsible to icon-only mode
- Navigation links
- Onboarding section
- Playlists section
- User profile section
- Keyboard navigation support

**State Management:**
- Uses `usePlayer` store for sidebar state
- `sidebarWidth` - Current width
- `isSidebarCollapsed` - Collapsed state

**Keyboard Shortcuts:**
- `Ctrl/Cmd + B` - Toggle sidebar (if implemented)

---

### AudioEngine

Audio processing engine using Web Audio API.

**Location:** `src/components/audio-engine.tsx`

**Props:**

```typescript
interface AudioEngineProps {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}
```

**Features:**
- Web Audio API integration
- Analyser node for spectrum analysis
- Dynamics compressor
- Gain node for volume control
- Optional TensorFlow.js AI EQ (not active)

**Note:** Currently not actively used in the main player. Audio playback is handled by Howler.js.

---

### SkeletonLoader

Loading skeleton components for better UX.

**Location:** `src/components/skeleton-loader.tsx`

**Components:**
- `TrackSkeleton` - Loading state for tracks
- `CardSkeleton` - Loading state for cards
- `ContentSectionSkeleton` - Loading state for sections
- `SearchResultsSkeleton` - Loading state for search results

**Example:**

```tsx
import { ContentSectionSkeleton } from '@/components/skeleton-loader';

{isLoading && (
  <>
    <ContentSectionSkeleton />
    <ContentSectionSkeleton />
    <ContentSectionSkeleton />
  </>
)}
```

---

## UI Components (shadcn/ui)

All UI components are from [shadcn/ui](https://ui.shadcn.com/) and located in `src/components/ui/`.

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`  
**Sizes:** `default`, `sm`, `lg`, `icon`

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

### Slider

```tsx
import { Slider } from '@/components/ui/slider';

<Slider
  value={[50]}
  onValueChange={([value]) => setValue(value)}
  min={0}
  max={100}
  step={1}
/>
```

---

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    Dialog content
  </DialogContent>
</Dialog>
```

---

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Switch

```tsx
import { Switch } from '@/components/ui/switch';

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

---

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">New</Badge>
```

**Variants:** `default`, `secondary`, `destructive`, `outline`

---

### Dial

Custom dial component for mood/vibe controls.

```tsx
import { Dial } from '@/components/ui/dial';

<Dial
  value={50}
  onChange={setValue}
  min={0}
  max={100}
  size={100}
  label="Vibe"
/>
```

---

### Progress

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={60} />
```

---

### Sheet

Side panel component.

```tsx
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    Side panel content
  </SheetContent>
</Sheet>
```

---

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Sonner (Toast)

Toast notification system.

```tsx
import { toast } from 'sonner';

// Success
toast.success('Operation successful');

// Error
toast.error('Operation failed');

// Info
toast.info('Information message');

// Warning
toast.warning('Warning message');
```

**Setup:** Add `<Toaster />` to root layout.

---

## Custom Hooks

### useKeyboardShortcuts

Keyboard shortcuts for player controls.

**Location:** `src/hooks/use-keyboard-shortcuts.ts`

**Shortcuts:**
- `Space` - Play/Pause
- `ArrowLeft` - Previous track
- `ArrowRight` - Next track
- `ArrowUp` - Volume up
- `ArrowDown` - Volume down
- `M` - Mute/Unmute
- `S` - Toggle shuffle
- `R` - Toggle repeat

**Usage:**

```tsx
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

function PlayerPage() {
  useKeyboardShortcuts(); // Automatically enables shortcuts
  // ...
}
```

---

## Component Best Practices

### 1. Memoization

Use `React.memo` for components that receive stable props:

```tsx
export const MyComponent = memo(({ data }: Props) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});
```

### 2. TypeScript

Always type component props:

```tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function MyComponent({ title, onClick, children }: MyComponentProps) {
  // Component code
}
```

### 3. Accessibility

- Use semantic HTML
- Add ARIA labels for icon-only buttons
- Ensure keyboard navigation
- Maintain focus management

### 4. Performance

- Use `useCallback` for event handlers
- Use `useMemo` for expensive computations
- Lazy load heavy components
- Optimize images with Next.js Image

### 5. Error Handling

- Use error boundaries for component errors
- Handle loading states
- Provide fallback UI
- Show user-friendly error messages

---

## Component Testing

All components should have tests. See `src/__tests__/components/` for examples.

**Example Test:**

```tsx
import { render, screen } from '@testing-library/react';
import { ContentCard } from '@/components/content-card';

test('renders card with title', () => {
  render(<ContentCard card={mockCard} />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

---

## Styling

Components use Tailwind CSS for styling. Follow these conventions:

- Use utility classes
- Use CSS variables for theming
- Maintain consistent spacing
- Follow mobile-first approach
- Use responsive breakpoints

**Color Palette:**
- Primary: Purple (`purple-500`, `purple-600`)
- Background: Dark gradients
- Text: White/Gray scale

---

**For more information, see:**
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
