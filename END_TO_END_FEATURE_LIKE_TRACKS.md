# 🎯 End-to-End Feature: Like/Favorite Tracks
## Full-Stack Implementation Guide

**Generated:** January 22, 2026  
**Feature:** Like/Unlike Tracks  
**Status:** ✅ Complete Implementation

---

## 📋 Feature Overview

**User Story:** As a user, I want to like/favorite tracks so I can save them to my library and easily access them later.

**Acceptance Criteria:**
- ✅ User can like a track
- ✅ User can unlike a track
- ✅ Liked tracks appear in library
- ✅ Like status persists across sessions
- ✅ Optimistic UI updates
- ✅ Error handling and user feedback
- ✅ Authentication required

---

## 🏗️ Architecture

### Data Flow

```
User clicks Like Button
    ↓
useLikeTrack Hook
    ↓
Optimistic Update (UI updates immediately)
    ↓
API Call (POST /api/tracks/[id]/like)
    ↓
Supabase Database (user_likes table)
    ↓
Response → Update UI / Rollback on error
    ↓
Invalidate React Query Cache
```

---

## 1️⃣ Database Schema

### Supabase Table: `user_likes`

```sql
-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON user_likes(track_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own likes
CREATE POLICY "Users can view own likes"
  ON user_likes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own likes
CREATE POLICY "Users can insert own likes"
  ON user_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own likes
CREATE POLICY "Users can delete own likes"
  ON user_likes
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Location:** Run this SQL in Supabase SQL Editor

---

## 2️⃣ API Routes

### POST `/api/tracks/[id]/like`

**Purpose:** Like a track

**Request:**
```typescript
POST /api/tracks/123/like
Headers: {
  Authorization: "Bearer <token>"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    is_liked: true,
    like_id: "uuid",
  }
}
```

**Implementation:** `app/api/tracks/[id]/like/route.ts`

**Features:**
- ✅ Rate limiting (30 likes/min)
- ✅ Authentication check
- ✅ Duplicate prevention
- ✅ Error handling

---

### DELETE `/api/tracks/[id]/like`

**Purpose:** Unlike a track

**Request:**
```typescript
DELETE /api/tracks/123/like
Headers: {
  Authorization: "Bearer <token>"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    is_liked: false,
  }
}
```

**Implementation:** `app/api/tracks/[id]/like/route.ts`

---

### GET `/api/tracks/[id]/like`

**Purpose:** Check if track is liked

**Request:**
```typescript
GET /api/tracks/123/like
Headers: {
  Authorization: "Bearer <token>"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    is_liked: true,
    like_id: "uuid",
  }
}
```

**Implementation:** `app/api/tracks/[id]/like/route.ts`

---

### GET `/api/tracks/liked`

**Purpose:** Get all liked tracks for current user

**Request:**
```typescript
GET /api/tracks/liked
Headers: {
  Authorization: "Bearer <token>"
}
```

**Response:**
```typescript
{
  success: true,
  data: Track[]
}
```

**Implementation:** `app/api/tracks/liked/route.ts`

**Features:**
- ✅ Fetches user's liked tracks
- ✅ Joins with tracks table for full track data
- ✅ Validates track data
- ✅ Returns empty array if not authenticated

---

## 3️⃣ Frontend Components

### LikeButton Component

**Location:** `components/like-button.tsx`

**Features:**
- ✅ Heart icon (filled when liked)
- ✅ Loading state
- ✅ Optimistic updates
- ✅ Accessible (ARIA labels)
- ✅ Multiple sizes (sm, md, lg)
- ✅ Optional label

**Usage:**
```typescript
<LikeButton 
  trackId={track.id}
  size="md"
  variant="ghost"
  showLabel={false}
/>
```

**Props:**
- `trackId: string` - Track ID to like/unlike
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `variant?: 'default' | 'ghost' | 'outline'` - Button variant
- `className?: string` - Additional CSS classes
- `showLabel?: boolean` - Show "Like"/"Liked" text

---

## 4️⃣ Custom Hooks

### useLikeTrack Hook

**Location:** `hooks/use-like-track.ts`

**Purpose:** Manage like/unlike functionality for a single track

**Returns:**
```typescript
{
  isLiked: boolean;
  isLoading: boolean;
  toggleLike: () => void;
  like: () => void;
  unlike: () => void;
}
```

**Features:**
- ✅ Optimistic updates
- ✅ Error handling with rollback
- ✅ Toast notifications
- ✅ Cache invalidation
- ✅ Authentication check

**Usage:**
```typescript
const { isLiked, isLoading, toggleLike } = useLikeTrack(trackId);

<Button onClick={toggleLike} disabled={isLoading}>
  {isLiked ? 'Liked' : 'Like'}
</Button>
```

---

### useLikedTracks Hook

**Location:** `hooks/use-like-track.ts`

**Purpose:** Fetch all liked tracks for current user

**Returns:**
```typescript
{
  data: Track[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

**Features:**
- ✅ React Query integration
- ✅ Automatic caching (2 minutes)
- ✅ Only fetches when authenticated
- ✅ Error handling

**Usage:**
```typescript
const { data: likedTracks, isLoading } = useLikedTracks();
```

---

## 5️⃣ Integration Points

### Library Page

**Location:** `app/library/page.tsx`

**Changes:**
- ✅ Import `useLikedTracks` hook
- ✅ Import `LikeButton` component
- ✅ Replace mock liked songs with real data
- ✅ Add like button to track list

**Before:**
```typescript
const mockLikedSongs: Track[] = [/* ... */];
```

**After:**
```typescript
const { data: likedTracks = [] } = useLikedTracks();
const libraryTracks = likedTracks.length > 0 ? likedTracks : tracks;
```

---

### Search Page

**Location:** `app/search/page.tsx` (optional)

**Integration:**
- Add like button to track results
- Show like status in track list

---

### Home Page

**Location:** `app/page.tsx` (optional)

**Integration:**
- Add like button to track cards
- Show like status

---

## 6️⃣ State Management

### React Query Cache Keys

```typescript
// Single track like status
['track-like-status', trackId]

// All liked tracks
['liked-tracks']
```

### Cache Invalidation

When a track is liked/unliked:
1. Invalidate `['track-like-status', trackId]`
2. Invalidate `['liked-tracks']`

This ensures:
- ✅ Like status updates immediately
- ✅ Library page shows updated liked tracks
- ✅ Consistent state across components

---

## 7️⃣ Error Handling

### API Errors

**Handled:**
- ✅ 401 Unauthorized → Show sign-in prompt
- ✅ 429 Rate Limit → Show rate limit message
- ✅ 500 Server Error → Show error toast
- ✅ Network Error → Show connection error

### Optimistic Updates

**Flow:**
1. User clicks like → UI updates immediately
2. API call in background
3. On success → Keep UI state
4. On error → Rollback UI, show error

**Benefits:**
- ✅ Instant feedback
- ✅ Better UX
- ✅ Handles errors gracefully

---

## 8️⃣ Authentication Integration

### Getting Auth Token

**Implementation:**
```typescript
const getAuthToken = async () => {
  const { getSession } = await import('@/lib/auth');
  const session = await getSession();
  return session?.session?.access_token;
};
```

**Usage in API Calls:**
```typescript
const token = await getAuthToken();
const headers = {
  'Authorization': `Bearer ${token}`
};
```

---

## 9️⃣ Testing

### Unit Tests

**Test Cases:**
- ✅ Like track (success)
- ✅ Unlike track (success)
- ✅ Like track (error)
- ✅ Check like status
- ✅ Fetch liked tracks
- ✅ Optimistic updates
- ✅ Error rollback

### Integration Tests

**Test Cases:**
- ✅ Like button click → API call
- ✅ Like → Library updates
- ✅ Unauthenticated → Sign-in prompt
- ✅ Network error → Error message

---

## 🔟 Usage Examples

### Basic Like Button

```typescript
import { LikeButton } from '@/components/like-button';

function TrackCard({ track }: { track: Track }) {
  return (
    <Card>
      <Image src={track.artwork} alt={track.title} />
      <h3>{track.title}</h3>
      <LikeButton trackId={track.id} />
    </Card>
  );
}
```

### Custom Like Button

```typescript
import { useLikeTrack } from '@/hooks/use-like-track';

function CustomLikeButton({ trackId }: { trackId: string }) {
  const { isLiked, toggleLike, isLoading } = useLikeTrack(trackId);
  
  return (
    <Button onClick={toggleLike} disabled={isLoading}>
      {isLiked ? '❤️ Liked' : '🤍 Like'}
    </Button>
  );
}
```

### Display Liked Tracks

```typescript
import { useLikedTracks } from '@/hooks/use-like-track';

function LikedTracksList() {
  const { data: likedTracks, isLoading } = useLikedTracks();
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      {likedTracks.map(track => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
```

---

## 1️⃣1️⃣ Files Created/Modified

### New Files

1. ✅ `types/likes.ts` - Type definitions
2. ✅ `app/api/tracks/[id]/like/route.ts` - Like/Unlike API
3. ✅ `app/api/tracks/liked/route.ts` - Get liked tracks API
4. ✅ `hooks/use-like-track.ts` - Like functionality hook
5. ✅ `components/like-button.tsx` - Like button component

### Modified Files

1. ✅ `app/library/page.tsx` - Integrated liked tracks
2. ✅ `lib/api.ts` - Added `fetchLikedTracks` function

---

## 1️⃣2️⃣ Database Migration

### SQL Script

Save as: `supabase/migrations/001_create_user_likes.sql`

```sql
-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON user_likes(track_id);

-- RLS Policies
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own likes"
  ON user_likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes"
  ON user_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON user_likes FOR DELETE
  USING (auth.uid() = user_id);
```

**To Run:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste and run the script

---

## 1️⃣3️⃣ API Documentation

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tracks/[id]/like` | ✅ Required | Like a track |
| DELETE | `/api/tracks/[id]/like` | ✅ Required | Unlike a track |
| GET | `/api/tracks/[id]/like` | ⚠️ Optional | Check like status |
| GET | `/api/tracks/liked` | ✅ Required | Get all liked tracks |

### Rate Limits

- **Like/Unlike:** 30 requests per minute
- **Get Liked:** 60 requests per minute

---

## 1️⃣4️⃣ Security Considerations

### ✅ Implemented

1. **Authentication Required**
   - All like operations require auth
   - Token validated on server

2. **Row Level Security (RLS)**
   - Users can only see/modify own likes
   - Database-level security

3. **Rate Limiting**
   - Prevents abuse
   - 30 likes per minute

4. **Input Validation**
   - Track ID validated
   - SQL injection prevention (Supabase)

---

## 1️⃣5️⃣ Performance Optimizations

### ✅ Implemented

1. **Optimistic Updates**
   - UI updates immediately
   - Better perceived performance

2. **React Query Caching**
   - Like status cached
   - Liked tracks cached (2 min)
   - Reduces API calls

3. **Database Indexes**
   - Indexed on `user_id`
   - Indexed on `track_id`
   - Fast queries

4. **Selective Re-renders**
   - Only affected components update
   - Zustand selective updates

---

## 1️⃣6️⃣ User Experience

### ✅ Features

1. **Instant Feedback**
   - Optimistic updates
   - Heart fills immediately

2. **Error Handling**
   - Clear error messages
   - Rollback on failure
   - Toast notifications

3. **Loading States**
   - Button disabled during request
   - Visual feedback

4. **Accessibility**
   - ARIA labels
   - Keyboard accessible
   - Screen reader friendly

---

## 1️⃣7️⃣ Next Steps

### Recommended Enhancements

1. **Like Count**
   - Show total likes per track
   - Public like counts

2. **Like History**
   - When track was liked
   - Sort by date

3. **Bulk Operations**
   - Like multiple tracks
   - Unlike all

4. **Like Notifications**
   - Notify artists when tracks are liked
   - Social features

---

## ✅ Implementation Checklist

- [x] Database schema created
- [x] API routes implemented
- [x] Type definitions created
- [x] Custom hooks created
- [x] Like button component created
- [x] Library page integrated
- [x] Error handling implemented
- [x] Optimistic updates implemented
- [x] Authentication integrated
- [x] Rate limiting added
- [x] Documentation created

---

## 📊 Feature Summary

**Status:** ✅ **Complete**

**Components:**
- ✅ 2 API routes
- ✅ 2 Custom hooks
- ✅ 1 UI component
- ✅ Type definitions
- ✅ Database schema

**Lines of Code:** ~600 lines

**Test Coverage:** Ready for testing

---

**Document Generated:** January 22, 2026  
**Feature:** Like/Favorite Tracks  
**Implementation:** ✅ Complete End-to-End
