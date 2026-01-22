# 🎵 EmPulse Music Max - Ultra Audio Player

A next-generation music player built with Next.js 15, React 19, and advanced audio technologies. Features gapless playback, AI-powered EQ, voice control, and real-time waveform visualization.

## ✨ Features

- **🎼 Advanced Audio Engine**
  - Gapless crossfade playback (2s)
  - Web Audio API with EQ, compressor, and 3D panner
  - Support for MP3, Opus, FLAC, AAC formats
  - HLS.js streaming support

- **🎨 Beautiful UI/UX**
  - Modern gradient design with glassmorphism
  - Framer Motion animations
  - Responsive grid layout
  - Real-time waveform visualization with WaveSurfer.js

- **🤖 AI Features**
  - TensorFlow.js integration for mood-based EQ
  - Beat detection and adaptive audio processing
  - Real-time spectrum analysis

- **🎤 Voice Control**
  - Speech Recognition API integration
  - Voice commands: "play", "pause", "next", "previous"

- **📱 PWA Support**
  - Offline playback with service worker
  - Installable as native app
  - Cached tracks and assets

- **🔄 State Management**
  - Zustand for player state
  - TanStack Query for data fetching
  - Shuffle and repeat modes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
cd web
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tracks/
│   │   │       └── route.ts      # API route for tracks
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Main player page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── audio-engine.tsx     # Audio processing engine
│   ├── store/
│   │   └── player-store.ts      # Zustand store
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/
│   ├── sw.js                    # Service worker
│   └── manifest.json            # PWA manifest
└── package.json
```

## 🔧 Configuration

### Supabase Integration (Optional)

To use Supabase for track storage:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a `tracks` table with columns:
   - `id` (uuid, primary key)
   - `title` (text)
   - `artist` (text)
   - `url` (text)
   - `artwork` (text)
   - `duration` (integer)

3. Add environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### AI EQ Model (Optional)

To enable AI-powered EQ:

1. Train or download a TensorFlow.js model
2. Save it as `/public/ai-eq-model.json`
3. Uncomment the model loading code in `audio-engine.tsx`

## 🎮 Usage

### Basic Controls

- **Play/Pause**: Click the play button or use voice command "play"
- **Next/Previous**: Use skip buttons or voice commands
- **Volume**: Adjust with the volume slider
- **Shuffle/Repeat**: Toggle with control buttons

### Voice Commands

- "play" - Play/pause
- "pause" - Pause playback
- "next" - Skip to next track
- "previous" or "back" - Go to previous track

### Track Selection

Click any track card in the grid to start playback.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3 (App Router)
- **UI**: React 19.0, Tailwind CSS 4.2, shadcn/ui
- **State**: Zustand 5.1, TanStack Query 5.61
- **Audio**: Howler.js 3.1, WaveSurfer.js 8.0, Web Audio API
- **Streaming**: HLS.js 1.6, Shaka Player 4.9
- **AI**: TensorFlow.js 4.22
- **Animations**: Framer Motion 11.6
- **Icons**: Lucide React 0.6

## 📦 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Railway

```bash
railway up
```

## 🔮 Future Enhancements

- [ ] Chromecast support
- [ ] WebXR spatial audio
- [ ] Karaoke lyrics sync
- [ ] Advanced EQ presets
- [ ] Playlist management
- [ ] Social sharing
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for your own music player!

## 🙏 Credits

Built with ❤️ using the latest web technologies. Inspired by modern music streaming platforms.

---

**Enjoy your music! 🎵⚡**
