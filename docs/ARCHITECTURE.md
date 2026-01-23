# 🏗️ Architecture Documentation
## EmPulse Music Max - System Architecture

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Overview

EmPulse Music Max is a modern music streaming application built with Next.js 16, React 19, and TypeScript. This document describes the system architecture, design patterns, and technical decisions.

---

## Technology Stack

### Frontend Framework
- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### State Management
- **Zustand 5.0.10** - Lightweight state management for player state
- **TanStack Query 5.90.19** - Server state management and caching

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.28.1** - Animation library
- **shadcn/ui** - Component library

### Audio
- **Howler.js 2.2.4** - Audio playback
- **WaveSurfer.js 7.12.1** - Waveform visualization
- **Web Audio API** - Audio processing (via AudioEngine)

### Data & Backend
- **Supabase** - Optional database backend
- **Next.js API Routes** - Serverless API endpoints

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

---

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── tracks/         # Tracks API
│   │   │   └── sections/       # Sections API
│   │   ├── artist/             # Artist pages
│   │   ├── genre/              # Genre pages
│   │   ├── playlist/           # Playlist pages
│   │   ├── search/             # Search page
│   │   ├── library/            # User library
│   │   ├── wellness/           # Wellness features
│   │   ├── onboarding/         # Onboarding flows
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── error-boundary.tsx  # Error boundary
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── content-card.tsx     # Content card component
│   │   ├── content-section.tsx  # Section component
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── audio-engine.tsx     # Audio processing
│   │   └── skeleton-loader.tsx # Loading states
│   ├── hooks/                  # Custom React hooks
│   │   └── use-keyboard-shortcuts.ts
│   ├── store/                  # State management
│   │   └── player-store.ts     # Zustand store
│   ├── lib/                    # Utilities
│   │   ├── utils.ts            # Utility functions
│   │   ├── constants.ts        # Constants
│   │   └── logger.ts           # Logging utility
│   ├── types/                  # TypeScript types
│   │   ├── content.ts          # Content types
│   │   └── wavesurfer.d.ts    # WaveSurfer types
│   └── __tests__/              # Test files
├── public/                     # Static assets
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Test setup
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies
```

---

## Architecture Patterns

### 1. Component Architecture

**Pattern:** Component-based architecture with separation of concerns

- **Pages** - Route-level components (`app/*/page.tsx`)
- **Components** - Reusable UI components (`components/`)
- **UI Components** - Base UI primitives (`components/ui/`)
- **Hooks** - Reusable logic (`hooks/`)

**Benefits:**
- Reusability
- Maintainability
- Testability
- Clear separation of concerns

---

### 2. State Management

**Pattern:** Hybrid state management

- **Zustand** - Client-side player state (queue, playback, UI state)
- **TanStack Query** - Server state (tracks, sections, API data)

**Why Zustand?**
- Lightweight (no boilerplate)
- TypeScript-friendly
- Simple API
- Good performance

**Why TanStack Query?**
- Automatic caching
- Background refetching
- Error handling
- Loading states

**State Flow:**

```
User Action → Component → Zustand Store → State Update → UI Re-render
User Action → Component → React Query → API → Cache Update → UI Re-render
```

---

### 3. Data Fetching

**Pattern:** React Query with API routes

**Flow:**
1. Component calls `useQuery` hook
2. React Query checks cache
3. If not cached, fetches from API route
4. API route fetches from Supabase (or returns mock data)
5. Data cached and returned to component

**Benefits:**
- Automatic caching
- Background updates
- Error retry logic
- Loading states

---

### 4. Routing

**Pattern:** Next.js App Router with file-based routing

**Routes:**
- `/` - Home page
- `/search` - Search page
- `/library` - User library
- `/artist/[id]` - Artist detail page
- `/playlist/[id]` - Playlist detail page
- `/genre/[id]` - Genre detail page
- `/wellness/*` - Wellness features
- `/onboarding/*` - Onboarding flows

**Navigation:**
- Use `next/navigation` `useRouter` hook
- Use `router.push()` for client-side navigation
- Avoid `window.location.href` for internal routes

---

### 5. Performance Optimization

**Patterns Used:**

1. **Code Splitting**
   - Dynamic imports for heavy libraries (WaveSurfer)
   - Route-based code splitting (automatic with Next.js)

2. **Memoization**
   - `React.memo` for components
   - `useMemo` for expensive computations
   - `useCallback` for event handlers

3. **Image Optimization**
   - Next.js Image component
   - Automatic format optimization (AVIF, WebP)
   - Lazy loading

4. **Caching**
   - React Query caching (5 minutes stale time)
   - Next.js automatic caching
   - Service worker for offline support

---

## Design Patterns

### 1. Container/Presentational Pattern

**Containers:** Pages that handle data fetching and state
**Presentational:** Components that receive props and render UI

**Example:**
- `page.tsx` (Container) - Fetches data, manages state
- `ContentCard` (Presentational) - Receives props, renders UI

---

### 2. Custom Hooks Pattern

Extract reusable logic into custom hooks:

```typescript
// hooks/use-keyboard-shortcuts.ts
export function useKeyboardShortcuts() {
  // Keyboard shortcut logic
}
```

**Benefits:**
- Reusability
- Testability
- Separation of concerns

---

### 3. Provider Pattern

Use React Context for global state (via Zustand):

```typescript
// Store is accessible globally via hook
const { queue, isPlaying } = usePlayer();
```

---

### 4. Error Boundary Pattern

Catch React errors at component tree level:

```typescript
// app/error-boundary.tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Data Flow

### Player State Flow

```
User clicks play
  ↓
Component calls togglePlay()
  ↓
Zustand store updates isPlaying
  ↓
Component re-renders with new state
  ↓
Howler.js plays audio
  ↓
requestAnimationFrame updates position
  ↓
UI updates progress bar
```

### Data Fetching Flow

```
Component mounts
  ↓
useQuery hook called
  ↓
React Query checks cache
  ↓
If not cached, fetches from /api/tracks
  ↓
API route returns data
  ↓
React Query caches data
  ↓
Component receives data
  ↓
Component renders with data
```

---

## Security Considerations

### 1. API Security
- Environment variables for sensitive data
- No API keys exposed in client code
- Supabase RLS (Row Level Security) for database

### 2. Client Security
- Input validation
- XSS prevention (React escapes by default)
- CSRF protection (Next.js built-in)

### 3. Authentication
- Not yet implemented
- Planned: Supabase Auth integration

---

## Scalability

### Current Limitations
- Single-page application
- Client-side state only
- No real-time features
- Limited offline support

### Future Improvements
- Server-side rendering for SEO
- Real-time updates (WebSockets)
- Offline-first architecture
- Microservices for backend
- CDN for static assets
- Database optimization

---

## Performance Metrics

### Current Performance
- **Initial Bundle:** Optimized with code splitting
- **Time to Interactive:** ~2-3s (estimated)
- **Re-renders:** Optimized with memoization
- **API Calls:** Cached for 5 minutes

### Optimization Strategies
- ✅ Code splitting
- ✅ Image optimization
- ✅ Component memoization
- ✅ React Query caching
- ⚠️ Bundle size monitoring (needed)
- ⚠️ Performance monitoring (needed)

---

## Testing Strategy

### Unit Tests
- Component tests
- Utility function tests
- Store action tests

### Integration Tests
- API route tests
- Data fetching tests
- User interaction tests

### E2E Tests
- Critical user flows
- Player functionality
- Navigation flows

**Coverage:** ~75% (target: 80%+)

---

## Deployment Architecture

### Development
- Local Next.js dev server
- Hot module replacement
- Source maps enabled

### Production
- Next.js build output
- Static assets on CDN
- API routes on serverless functions
- Database on Supabase

### Recommended Platforms
- **Vercel** - Optimal for Next.js
- **Railway** - Alternative platform
- **Netlify** - Static site hosting

---

## Future Architecture Improvements

1. **Microservices**
   - Separate API service
   - Separate audio processing service
   - Separate analytics service

2. **Real-time Features**
   - WebSocket server
   - Real-time collaboration
   - Live updates

3. **Caching Strategy**
   - Redis for API caching
   - CDN for static assets
   - Service worker for offline

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Analytics

---

## Best Practices

### Code Organization
- ✅ Clear file structure
- ✅ Consistent naming
- ✅ TypeScript strict mode
- ✅ Component composition

### Performance
- ✅ Memoization where needed
- ✅ Code splitting
- ✅ Image optimization
- ✅ Caching strategy

### Maintainability
- ✅ TypeScript for type safety
- ✅ Component documentation
- ✅ Test coverage
- ✅ Error handling

---

**For more information, see:**
- [Next.js Architecture](https://nextjs.org/docs)
- [React Patterns](https://react.dev/learn)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
