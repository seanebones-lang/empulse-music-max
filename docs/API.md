# 📡 API Documentation
## EmPulse Music Max - API Reference

**Last Updated:** $(date)  
**Version:** 1.0.0

---

## Overview

The EmPulse Music Max API provides endpoints for fetching tracks, sections, and managing content. The API is built using Next.js App Router API routes.

**Base URL:** `/api`

---

## Endpoints

### 1. Get Tracks

Fetch a list of tracks available for playback.

**Endpoint:** `GET /api/tracks`

**Response:** `200 OK`

```typescript
interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
  duration: number; // in seconds
}
```

**Example Response:**

```json
[
  {
    "id": "1",
    "title": "EmPulse Beat 1",
    "artist": "RE Artist",
    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "artwork": "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Track+1",
    "duration": 210
  }
]
```

**Behavior:**
- If Supabase is configured, fetches tracks from the database
- If Supabase is not configured, returns mock data
- Returns empty array on error

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch tracks"
}
```

---

### 2. Get Sections

Fetch content sections for the home page.

**Endpoint:** `GET /api/sections`

**Response:** `200 OK`

```typescript
interface Section {
  id: string;
  title: string;
  type: 'feature' | 'genre' | 'custom';
  items: ContentCard[];
  showAllLink?: string;
}

interface ContentCard {
  id: string;
  type: 'genre' | 'feature' | 'artist' | 'playlist' | 'album' | 'track';
  title: string;
  subtitle?: string;
  image: string;
  description?: string;
  items?: ContentCard[];
  tracks?: Track[];
  metadata?: {
    trackCount?: number;
    duration?: number;
    priority?: string;
    status?: string;
    effort?: string;
    [key: string]: string | number | undefined;
  };
}
```

**Example Response:**

```json
[
  {
    "id": "mood-wellness",
    "title": "Mood & Wellness",
    "type": "feature",
    "items": [
      {
        "id": "feature-daily-mood-checkin",
        "type": "feature",
        "title": "Daily Mood Check-In",
        "subtitle": "Complete daily mood + energy check-in",
        "image": "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Daily+Mood",
        "description": "Users complete one daily mood + energy check-in...",
        "metadata": {
          "priority": "High / Q1 Polish",
          "status": "Implemented",
          "effort": "Medium"
        }
      }
    ]
  }
]
```

**Behavior:**
- Currently returns mock data
- In production, would fetch from database
- Always returns array (never null)

---

## Configuration

### Supabase Integration

To use Supabase for track storage:

1. **Set Environment Variables:**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Create Tracks Table:**

```sql
CREATE TABLE tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT NOT NULL,
  artwork TEXT,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

3. **API Behavior:**
   - If Supabase is configured, `/api/tracks` fetches from database
   - If not configured, returns mock data
   - Falls back gracefully on errors

---

## Error Handling

All API routes implement error handling:

- **Database Errors:** Returns 500 with error message
- **Network Errors:** Returns 500 with generic error
- **Missing Data:** Returns empty array (tracks) or empty sections array

**Error Response Format:**

```json
{
  "error": "Error message here"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider:

- Implementing rate limiting middleware
- Using Next.js middleware for API protection
- Adding authentication for sensitive endpoints

---

## CORS

API routes are same-origin by default. For cross-origin requests:

- Configure CORS headers in Next.js middleware
- Use Next.js API route headers
- Consider using a reverse proxy

---

## Future Endpoints

Planned endpoints (not yet implemented):

- `POST /api/tracks` - Create new track
- `PUT /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track
- `POST /api/sections` - Create section
- `GET /api/artists` - Get artists
- `GET /api/playlists` - Get playlists
- `POST /api/playlists` - Create playlist

---

## Testing

API routes can be tested using:

```bash
# Using curl
curl http://localhost:3000/api/tracks
curl http://localhost:3000/api/sections

# Using fetch in browser console
fetch('/api/tracks').then(r => r.json()).then(console.log)
```

---

## TypeScript Types

All API types are defined in:

- `src/store/player-store.ts` - `Track` type
- `src/types/content.ts` - `Section`, `ContentCard` types

---

## Examples

### Fetching Tracks in React

```typescript
import { useQuery } from '@tanstack/react-query';
import { Track } from '@/store/player-store';

const fetchTracks = async (): Promise<Track[]> => {
  const response = await fetch('/api/tracks');
  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }
  return response.json();
};

function MyComponent() {
  const { data: tracks, isLoading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {tracks?.map(track => (
        <div key={track.id}>{track.title}</div>
      ))}
    </div>
  );
}
```

### Fetching Sections

```typescript
import { useQuery } from '@tanstack/react-query';
import { Section } from '@/types/content';

const fetchSections = async (): Promise<Section[]> => {
  const response = await fetch('/api/sections');
  if (!response.ok) {
    throw new Error('Failed to fetch sections');
  }
  return response.json();
};

function HomePage() {
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: fetchSections,
  });

  return (
    <div>
      {sections?.map(section => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          {/* Render section items */}
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Use React Query:** Always use `@tanstack/react-query` for data fetching
2. **Error Handling:** Always handle loading and error states
3. **Type Safety:** Use TypeScript types for API responses
4. **Caching:** React Query handles caching automatically
5. **Retry Logic:** Configure retry in React Query options

---

**For more information, see:**
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Query Documentation](https://tanstack.com/query/latest)
