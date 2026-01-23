# 🏛️ Architecture Patterns Explained
## EmPulse Music Max - Complete Pattern Guide

**Generated:** January 22, 2026  
**Purpose:** Educational guide explaining all architecture and design patterns used

---

## 📚 Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Component Architecture Patterns](#2-component-architecture-patterns)
3. [State Management Patterns](#3-state-management-patterns)
4. [Data Flow Patterns](#4-data-flow-patterns)
5. [Design Patterns](#5-design-patterns)
6. [Performance Patterns](#6-performance-patterns)
7. [Security Patterns](#7-security-patterns)
8. [Code Organization Patterns](#8-code-organization-patterns)

---

## 1️⃣ High-Level Architecture

### Pattern: **Layered Architecture**

The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, UI)                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Hooks, State Management)              │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  (Business Logic, Types)                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (API, Database, External Services)     │
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy to test each layer independently
- ✅ Easy to replace implementations
- ✅ Maintainable and scalable

**Example:**
```typescript
// Presentation Layer
export default function Home() {
  // Application Layer
  const { queue, isPlaying } = usePlayer();
  const { data: tracks } = useQuery({ queryKey: ['tracks'], queryFn: fetchTracks });
  
  // Domain Layer (types)
  // Infrastructure Layer (API calls)
}
```

---

## 2️⃣ Component Architecture Patterns

### Pattern 1: **Component-Based Architecture**

**Definition:** Building UI as a composition of reusable, independent components.

**Structure:**
```
components/
├── ui/              # Base UI primitives (Button, Input, etc.)
├── content-card.tsx # Domain-specific components
├── sidebar.tsx      # Feature components
└── ...
```

**Example:**
```typescript
// Base UI Component
<Button variant="ghost" onClick={handleClick}>
  Play
</Button>

// Domain Component
<ContentCard card={track} onClick={handleCardClick} />

// Feature Component
<Sidebar />
```

**Benefits:**
- ✅ Reusability
- ✅ Maintainability
- ✅ Testability
- ✅ Composition

---

### Pattern 2: **Container/Presentational Pattern**

**Definition:** Separating components that handle logic (containers) from components that render UI (presentational).

**Container Component:**
```typescript
// app/page.tsx (Container)
export default function Home() {
  // Data fetching
  const { data: tracks } = useQuery({ queryKey: ['tracks'], queryFn: fetchTracks });
  
  // State management
  const { queue, isPlaying, togglePlay } = usePlayer();
  
  // Business logic
  const handleCardClick = (card: ContentCardType) => {
    // Logic here
  };
  
  // Render presentational components
  return (
    <ContentSection section={section} onCardClick={handleCardClick} />
  );
}
```

**Presentational Component:**
```typescript
// components/content-card.tsx (Presentational)
interface ContentCardProps {
  card: ContentCardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ContentCard({ card, onClick, size = 'md' }: ContentCardProps) {
  // No business logic, just rendering
  return (
    <Card onClick={onClick}>
      <Image src={card.image} alt={card.title} />
      <h3>{card.title}</h3>
    </Card>
  );
}
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Reusable presentational components
- ✅ Easier testing
- ✅ Clear data flow

---

### Pattern 3: **Composition Pattern**

**Definition:** Building complex components by composing simpler ones.

**Example:**
```typescript
// Complex component built from simpler ones
<Card>
  <CardHeader>
    <CardTitle>Player</CardTitle>
  </CardHeader>
  <CardContent>
    <PlayerControls />
    <MoodControls />
  </CardContent>
</Card>
```

**Benefits:**
- ✅ Flexibility
- ✅ Reusability
- ✅ Maintainability

---

## 3️⃣ State Management Patterns

### Pattern 1: **Hybrid State Management**

**Definition:** Using different state management solutions for different types of state.

**Client State (Zustand):**
```typescript
// store/player-store.ts
export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  isPlaying: false,
  volume: 0.8,
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
}));
```

**Server State (React Query):**
```typescript
// In components
const { data: tracks, isLoading, error } = useQuery({
  queryKey: ['tracks'],
  queryFn: () => fetchTracks<Track>(),
  staleTime: 5 * 60 * 1000,
});
```

**Local State (useState):**
```typescript
// Component-specific state
const [isOpen, setIsOpen] = useState(false);
```

**Why This Pattern?**
- ✅ **Zustand** for client state (lightweight, fast)
- ✅ **React Query** for server state (caching, refetching)
- ✅ **useState** for component state (simple, local)

---

### Pattern 2: **Global State Pattern (Zustand)**

**Definition:** Centralized state accessible from any component.

**Implementation:**
```typescript
// Store definition
interface PlayerState {
  queue: Track[];
  isPlaying: boolean;
  // ... state
  togglePlay: () => void;
  // ... actions
}

export const usePlayer = create<PlayerState>((set, get) => ({
  // State
  queue: [],
  isPlaying: false,
  
  // Actions
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
}));
```

**Usage:**
```typescript
// In any component
const { queue, isPlaying, togglePlay } = usePlayer();
```

**Benefits:**
- ✅ No prop drilling
- ✅ Type-safe
- ✅ Performant (selective updates)
- ✅ Simple API

---

### Pattern 3: **Provider Pattern (React Context)**

**Definition:** Providing global state through React Context.

**Implementation:**
```typescript
// components/auth-provider.tsx
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();
  
  return (
    <AuthContext.Provider value={{
      user: auth.user,
      loading: auth.loading,
      authenticated: auth.authenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Usage:**
```typescript
// In layout.tsx
<AuthProvider>
  <App />
</AuthProvider>

// In components
const { user, authenticated } = useAuthContext();
```

**Benefits:**
- ✅ Global state without prop drilling
- ✅ React-native pattern
- ✅ Good for auth state

---

## 4️⃣ Data Flow Patterns

### Pattern 1: **Unidirectional Data Flow**

**Definition:** Data flows in one direction: down from parent to child, actions flow up.

**Flow:**
```
State (Zustand/React Query)
    ↓
Props to Components
    ↓
User Interaction
    ↓
Actions/Callbacks
    ↓
State Update
    ↓
Re-render
```

**Example:**
```typescript
// 1. State in store
const { queue, isPlaying, togglePlay } = usePlayer();

// 2. Pass to component
<PlayerControls isPlaying={isPlaying} onToggle={togglePlay} />

// 3. User clicks
<Button onClick={onToggle}>Play</Button>

// 4. Action updates state
togglePlay() // Updates isPlaying in store

// 5. Component re-renders with new state
```

**Benefits:**
- ✅ Predictable
- ✅ Easy to debug
- ✅ Clear data flow

---

### Pattern 2: **API → Store → Component Flow**

**Definition:** Fetching data from API, syncing to store, then rendering in components.

**Flow:**
```
Component Mounts
    ↓
useQuery Hook Called
    ↓
React Query Checks Cache
    ↓
If Not Cached → API Call
    ↓
API Returns Data
    ↓
React Query Caches Data
    ↓
useEffect Syncs to Store (optional)
    ↓
Component Receives Data
    ↓
Component Renders
```

**Example:**
```typescript
// 1. Fetch data
const { data: tracks } = useQuery({
  queryKey: ['tracks'],
  queryFn: () => fetchTracks<Track>(),
});

// 2. Sync to store
useEffect(() => {
  if (tracks) {
    setQueue(tracks);
  }
}, [tracks, setQueue]);

// 3. Use in component
const { queue } = usePlayer();
```

**Benefits:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Loading/error states
- ✅ Store synchronization

---

### Pattern 3: **Event-Driven Architecture**

**Definition:** Components communicate through events/callbacks.

**Example:**
```typescript
// Parent component
<ContentCard 
  card={track}
  onClick={() => handleCardClick(track)} // Event handler
/>

// Child component
function ContentCard({ card, onClick }: Props) {
  return <Card onClick={onClick}>...</Card>;
}
```

**Benefits:**
- ✅ Loose coupling
- ✅ Flexible communication
- ✅ Easy to test

---

## 5️⃣ Design Patterns

### Pattern 1: **Custom Hooks Pattern**

**Definition:** Extracting reusable logic into custom hooks.

**Example:**
```typescript
// hooks/use-auth.ts
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadSession();
  }, []);
  
  return {
    user,
    loading,
    authenticated: !!user,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
```

**Usage:**
```typescript
// In any component
const { user, authenticated, signIn } = useAuth();
```

**Benefits:**
- ✅ Reusability
- ✅ Testability
- ✅ Separation of concerns
- ✅ Clean component code

**Hooks in Codebase:**
- `use-auth.ts` - Authentication logic
- `use-voice-control.ts` - Voice command handling
- `use-keyboard-shortcuts.ts` - Keyboard shortcuts
- `use-api-sync.ts` - API to store synchronization

---

### Pattern 2: **Error Boundary Pattern**

**Definition:** Catching React errors at component tree level.

**Implementation:**
```typescript
// app/error-boundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Usage:**
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Benefits:**
- ✅ Graceful error handling
- ✅ Prevents app crashes
- ✅ User-friendly error messages

---

### Pattern 3: **Factory Pattern (API Response)**

**Definition:** Creating standardized objects through factory functions.

**Example:**
```typescript
// lib/api-response.ts
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function errorResponse(
  error: string | Error,
  status = 500
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : error },
    { status }
  );
}
```

**Usage:**
```typescript
// In API routes
return successResponse(tracks);
return errorResponse('Not found', 404);
```

**Benefits:**
- ✅ Consistent response format
- ✅ Type-safe
- ✅ Easy to maintain

---

### Pattern 4: **Strategy Pattern (Icon Mapping)**

**Definition:** Selecting algorithm at runtime based on context.

**Example:**
```typescript
// components/content-card.tsx
const featureIconMap: Record<string, LucideIcon> = {
  'feature-daily-mood-checkin': Heart,
  'feature-mood-journal': Calendar,
  'feature-affirmations': Sparkles,
  // ... more mappings
};

// Select icon based on card ID
const Icon = featureIconMap[card.id] || Music;
```

**Benefits:**
- ✅ Flexible
- ✅ Easy to extend
- ✅ No if/else chains

---

### Pattern 5: **Observer Pattern (Auth State)**

**Definition:** Components observe and react to state changes.

**Example:**
```typescript
// components/auth-provider.tsx
useEffect(() => {
  const supabase = createSupabaseClient();
  if (!supabase) return;

  // Subscribe to auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      auth.refresh(); // Notify observers
    }
  );

  return () => subscription.unsubscribe();
}, [auth]);
```

**Benefits:**
- ✅ Reactive updates
- ✅ Loose coupling
- ✅ Real-time synchronization

---

## 6️⃣ Performance Patterns

### Pattern 1: **Memoization Pattern**

**Definition:** Caching expensive computations and preventing unnecessary re-renders.

**React.memo:**
```typescript
// components/player-controls.tsx
export const PlayerControls = memo(({ isPlaying, onToggle }: Props) => {
  // Component only re-renders if props change
  return <Button onClick={onToggle}>{isPlaying ? 'Pause' : 'Play'}</Button>;
});
```

**useMemo:**
```typescript
// app/search/page.tsx
const filteredTracks = useMemo(() => {
  return tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [tracks, searchQuery]); // Only recompute when dependencies change
```

**useCallback:**
```typescript
// components/player-controls.tsx
const handleVolumeChange = useCallback((value: number[]) => {
  setVolume(value[0]);
}, [setVolume]); // Stable function reference
```

**Benefits:**
- ✅ Prevents unnecessary re-renders
- ✅ Optimizes expensive computations
- ✅ Better performance

---

### Pattern 2: **Code Splitting Pattern**

**Definition:** Loading code only when needed.

**Dynamic Imports:**
```typescript
// Lazy load heavy library
const WaveSurfer = dynamic(() => import('wavesurfer.js'), {
  ssr: false, // Don't load on server
});
```

**Route-Based Splitting:**
```typescript
// Next.js automatically splits by route
// /artist/dashboard → separate bundle
// /search → separate bundle
```

**Benefits:**
- ✅ Smaller initial bundle
- ✅ Faster page loads
- ✅ Better performance

---

### Pattern 3: **Lazy Loading Pattern**

**Definition:** Loading resources only when needed.

**Image Lazy Loading:**
```typescript
// Next.js Image component
<Image 
  src={card.image} 
  alt={card.title}
  loading="lazy" // Load when in viewport
/>
```

**Component Lazy Loading:**
```typescript
// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

**Benefits:**
- ✅ Faster initial load
- ✅ Better user experience
- ✅ Reduced bandwidth

---

### Pattern 4: **Caching Pattern**

**Definition:** Storing frequently accessed data to avoid repeated computation/requests.

**React Query Caching:**
```typescript
const { data: tracks } = useQuery({
  queryKey: ['tracks'],
  queryFn: () => fetchTracks(),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

**Benefits:**
- ✅ Faster responses
- ✅ Reduced API calls
- ✅ Better performance

---

## 7️⃣ Security Patterns

### Pattern 1: **Middleware Pattern (Route Protection)**

**Definition:** Intercepting requests to add security checks.

**Implementation:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('sb-access-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

**Benefits:**
- ✅ Centralized security
- ✅ Route protection
- ✅ Authentication checks

---

### Pattern 2: **Protected Route Pattern**

**Definition:** Wrapping routes/components that require authentication.

**Implementation:**
```typescript
// components/protected-route.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuthContext();
  
  if (loading) return <Loading />;
  if (!authenticated) return <Redirect to="/auth/login" />;
  
  return <>{children}</>;
}
```

**Usage:**
```typescript
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>
```

**Benefits:**
- ✅ Reusable protection
- ✅ Clear authentication requirements
- ✅ User-friendly redirects

---

### Pattern 3: **Input Validation Pattern**

**Definition:** Validating user input before processing.

**Implementation:**
```typescript
// lib/validation.ts
export const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
});

// In components
const result = signUpSchema.safeParse(formData);
if (!result.success) {
  // Show validation errors
}
```

**Benefits:**
- ✅ Prevents invalid data
- ✅ Better security
- ✅ User feedback

---

### Pattern 4: **Rate Limiting Pattern**

**Definition:** Limiting requests to prevent abuse.

**Implementation:**
```typescript
// lib/rate-limit.ts
export function checkRateLimit(
  request: Request,
  maxRequests: number = 60,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  // Check rate limit
  // Return status
}

// In API routes
const rateLimit = checkRateLimit(request);
if (!rateLimit.allowed) {
  return errorResponse('Rate limit exceeded', 429);
}
```

**Benefits:**
- ✅ Prevents abuse
- ✅ Protects API
- ✅ Fair resource usage

---

## 8️⃣ Code Organization Patterns

### Pattern 1: **Feature-Based Organization**

**Definition:** Organizing code by features rather than file types.

**Structure:**
```
app/
├── artist/
│   ├── dashboard/
│   ├── upload/
│   └── signup/
├── wellness/
│   ├── checkin/
│   ├── journal/
│   └── affirmations/
└── ...
```

**Benefits:**
- ✅ Related code together
- ✅ Easy to find features
- ✅ Scalable

---

### Pattern 2: **Layered Organization**

**Definition:** Organizing code by architectural layers.

**Structure:**
```
src/
├── app/          # Presentation layer
├── components/    # UI components
├── hooks/         # Application layer
├── lib/           # Domain/Infrastructure layer
├── store/         # State management
└── types/         # Type definitions
```

**Benefits:**
- ✅ Clear separation
- ✅ Easy navigation
- ✅ Maintainable

---

### Pattern 3: **Barrel Export Pattern**

**Definition:** Re-exporting modules from index files.

**Example:**
```typescript
// components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card } from './card';

// Usage
import { Button, Input, Card } from '@/components/ui';
```

**Benefits:**
- ✅ Clean imports
- ✅ Easy to refactor
- ✅ Better organization

---

## 📊 Pattern Summary

| Pattern | Purpose | Example |
|---------|---------|---------|
| **Layered Architecture** | Separation of concerns | app/ → hooks/ → lib/ |
| **Component-Based** | Reusable UI | `<Button>`, `<Card>` |
| **Container/Presentational** | Logic vs UI | `page.tsx` vs `ContentCard` |
| **Hybrid State Management** | Right tool for right job | Zustand + React Query |
| **Custom Hooks** | Reusable logic | `useAuth()`, `useVoiceControl()` |
| **Error Boundary** | Error handling | `<ErrorBoundary>` |
| **Memoization** | Performance | `React.memo`, `useMemo` |
| **Code Splitting** | Performance | Dynamic imports |
| **Middleware** | Security | Route protection |
| **Protected Route** | Security | `<ProtectedRoute>` |

---

## 🎯 When to Use Each Pattern

### Use **Container/Presentational** when:
- ✅ Component has both logic and UI
- ✅ Want to separate concerns
- ✅ Need reusable presentational components

### Use **Custom Hooks** when:
- ✅ Logic is reused across components
- ✅ Want to extract complex logic
- ✅ Need testable logic

### Use **Zustand** when:
- ✅ Need global client state
- ✅ Want simple state management
- ✅ Need type-safe state

### Use **React Query** when:
- ✅ Fetching server data
- ✅ Need caching
- ✅ Want loading/error states

### Use **Memoization** when:
- ✅ Expensive computations
- ✅ Preventing unnecessary re-renders
- ✅ Optimizing performance

---

## 📚 Further Reading

- [React Patterns](https://react.dev/learn)
- [Next.js Architecture](https://nextjs.org/docs)
- [Zustand Patterns](https://zustand-demo.pmnd.rs/)
- [React Query Patterns](https://tanstack.com/query/latest)

---

**Document Generated:** January 22, 2026  
**Status:** ✅ Complete guide to all architecture patterns
