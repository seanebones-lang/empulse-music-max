# 👨‍💻 Developer Guide
## EmPulse Music Max - Complete Developer Reference

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Setup](#project-setup)
3. [Development Workflow](#development-workflow)
4. [Code Structure](#code-structure)
5. [State Management](#state-management)
6. [Data Fetching](#data-fetching)
7. [Styling Guide](#styling-guide)
8. [Testing Guide](#testing-guide)
9. [Debugging](#debugging)
10. [Performance Optimization](#performance-optimization)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** 2.30+
- **Code Editor** (VS Code recommended)

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/empulse-music-max.git
cd empulse-music-max

# Install dependencies
cd web
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

---

## Project Setup

### Environment Variables

Create `.env.local` in `web/` directory:

```bash
# Optional: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### VS Code Setup

**Recommended Extensions:**
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Error Lens

**Settings (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

### Development Server

- **URL:** `http://localhost:3000`
- **Hot Reload:** Automatic on file changes
- **Fast Refresh:** React Fast Refresh enabled
- **Source Maps:** Enabled for debugging

---

## Code Structure

### Directory Organization

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── [routes]/    # Page routes
│   ├── layout.tsx    # Root layout
│   └── page.tsx     # Home page
├── components/       # React components
│   ├── ui/          # Base UI components
│   └── [components]  # Feature components
├── hooks/           # Custom React hooks
├── store/           # State management
├── lib/             # Utilities
├── types/           # TypeScript types
└── __tests__/       # Test files
```

### File Naming Conventions

- **Components:** PascalCase (`ContentCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useKeyboardShortcuts.ts`)
- **Utils:** camelCase (`utils.ts`)
- **Types:** camelCase (`content.ts`)
- **Tests:** Same name with `.test.tsx` suffix

---

## State Management

### Zustand Store

**Location:** `src/store/player-store.ts`

**Usage:**

```typescript
import { usePlayer } from '@/store/player-store';

function MyComponent() {
  // Get all state
  const { queue, isPlaying, volume } = usePlayer();

  // Get specific state (optimized)
  const isPlaying = usePlayer((state) => state.isPlaying);

  // Actions
  const { togglePlay, setVolume, handleNext } = usePlayer();
}
```

**Store Structure:**

```typescript
interface PlayerState {
  // Queue
  queue: Track[];
  currentIndex: number;

  // Playback
  isPlaying: boolean;
  volume: number;
  position: number;
  duration: number;

  // Controls
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';

  // Actions
  setQueue: (queue: Track[]) => void;
  togglePlay: () => void;
  handleNext: () => void;
  // ... more actions
}
```

### React Query

**Usage:**

```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}
```

---

## Data Fetching

### API Routes

**Location:** `src/app/api/`

**Example:**

```typescript
// app/api/tracks/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch data
  const tracks = await fetchTracks();
  return NextResponse.json(tracks);
}
```

### Fetching in Components

```typescript
// Using React Query
const { data: tracks } = useQuery({
  queryKey: ['tracks'],
  queryFn: async () => {
    const response = await fetch('/api/tracks');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
});
```

---

## Styling Guide

### Tailwind CSS

**Usage:**

```tsx
<div className="flex items-center gap-4 p-6 bg-purple-500 rounded-lg">
  <span className="text-white font-semibold">Text</span>
</div>
```

**Responsive Design:**

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

**Custom Colors:**

Defined in `tailwind.config.js` or `globals.css`:

```css
:root {
  --purple-500: #8b5cf6;
  --purple-600: #7c3aed;
}
```

### Component Styling

- Use utility classes
- Extract repeated patterns
- Use CSS variables for theming
- Follow mobile-first approach

---

## Testing Guide

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Writing Tests

**Component Test:**

```typescript
import { render, screen } from '@testing-library/react';
import { ContentCard } from '@/components/content-card';

test('renders card title', () => {
  render(<ContentCard card={mockCard} />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

**Store Test:**

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePlayer } from '@/store/player-store';

test('toggles play state', () => {
  const { result } = renderHook(() => usePlayer());
  
  act(() => {
    result.current.togglePlay();
  });
  
  expect(result.current.isPlaying).toBe(true);
});
```

---

## Debugging

### Browser DevTools

- **React DevTools** - Component inspection
- **Redux DevTools** - State inspection (Zustand compatible)
- **Network Tab** - API requests
- **Console** - Logs and errors

### VS Code Debugging

**`.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Logging

**Use logger utility:**

```typescript
import { logger } from '@/lib/logger';

logger.log('Debug message');
logger.error('Error message');
logger.warn('Warning message');
```

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### Memoization

```typescript
// Memoize component
const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});

// Memoize value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callback
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={300}
  priority // For above-fold images
/>
```

---

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Set in deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Troubleshooting

### Common Issues

**1. Audio not playing**
- Check browser autoplay policies
- Ensure user interaction before play
- Check CORS headers

**2. Tests failing**
- Clear `.next` folder
- Reinstall dependencies
- Check test environment

**3. Build errors**
- Check TypeScript errors
- Verify all imports
- Check environment variables

**4. Styling issues**
- Clear Tailwind cache
- Restart dev server
- Check CSS import order

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Framer Motion](https://www.framer.com/motion/)

---

**Happy Coding! 🎵⚡**
