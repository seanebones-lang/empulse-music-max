# 🚀 Quick Setup Guide

## One-Command Setup

```bash
cd web
npm install
npm run dev
```

That's it! The app will be running at `http://localhost:3000`

## What's Included

✅ Next.js 15 with App Router  
✅ TypeScript configuration  
✅ Tailwind CSS 4.2  
✅ shadcn/ui components  
✅ Zustand state management  
✅ TanStack Query for data fetching  
✅ Howler.js for audio playback  
✅ WaveSurfer.js for waveform visualization  
✅ Voice control (Speech Recognition API)  
✅ PWA support with service worker  
✅ API route for tracks (Supabase ready)  

## Optional: Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Create a `tracks` table:

```sql
create table tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  url text not null,
  artwork text,
  duration integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

4. Add environment variables to `web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Testing the Player

The app comes with 4 sample tracks from SoundHelix. You can:

- Click any track to play
- Use voice commands: "play", "pause", "next", "previous"
- Adjust volume with the slider
- Toggle shuffle and repeat modes
- See real-time waveform visualization

## Building for Production

```bash
cd web
npm run build
npm start
```

## Deploying

### Vercel (Recommended)

```bash
npm install -g vercel
cd web
vercel --prod
```

### Railway

```bash
railway init
railway up
```

## Troubleshooting

**Audio not playing?**
- Check browser console for CORS errors
- Some browsers require user interaction before playing audio
- Try clicking the play button directly

**Voice control not working?**
- Requires HTTPS (or localhost)
- Check browser permissions for microphone
- Chrome/Edge recommended for best support

**Waveform not showing?**
- Check browser console for errors
- Ensure audio file is accessible
- Try a different audio source

## Next Steps

- Add your own tracks via Supabase
- Customize the UI colors in `globals.css`
- Train an AI EQ model for automatic audio enhancement
- Add more features from the roadmap in README.md

Enjoy your music! 🎵
