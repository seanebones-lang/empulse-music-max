'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Radio,
  Play,
  TrendingUp,
} from 'lucide-react';
import { usePlayer, type Track } from '@/store/player-store';
import { toast } from 'sonner';
import Image from 'next/image';
import { ContentCard } from '@/components/content-card';

// Mock genre data - in production, fetch from API
const mockGenres: Record<string, { name: string; description: string; color: string; tracks: Track[] }> = {
  'hiphop-rap': {
    name: 'Hip-Hop/Rap',
    description: 'The most streamed genre worldwide',
    color: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    tracks: [
      {
        id: '1',
        title: 'Hip Hop Track 1',
        artist: 'Rap Artist',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        artwork: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=HipHop',
        duration: 210,
      },
      {
        id: '2',
        title: 'Hip Hop Track 2',
        artist: 'Rap Artist 2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        artwork: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=HipHop',
        duration: 180,
      },
    ],
  },
  'pop': {
    name: 'Pop',
    description: 'Popular hits and chart toppers',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    tracks: [
      {
        id: '3',
        title: 'Pop Track 1',
        artist: 'Pop Artist',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        artwork: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=Pop',
        duration: 195,
      },
    ],
  },
};

export default function GenreDetailPage() {
  const params = useParams();
  const genreId = params.id as string;
  const { sidebarWidth, isSidebarCollapsed, setQueue, setCurrentIndex, togglePlay } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  // In production, fetch genre data based on genreId
  const genre = mockGenres[genreId] || mockGenres['hiphop-rap'];

  const handlePlayAll = () => {
    setQueue(genre.tracks);
    setCurrentIndex(0);
    togglePlay();
    toast.success(`Now playing: ${genre.name}`);
  };

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Genre Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-6"
        >
          <div className={`w-60 h-60 rounded-2xl ${genre.color} flex items-center justify-center shadow-2xl`}>
            <Radio className="h-32 w-32 text-white/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-bold text-white">{genre.name}</h1>
              <Badge variant="outline" className={genre.color}>
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
            <p className="text-gray-400 mb-4 text-lg">{genre.description}</p>
            <div className="flex gap-3">
              <Button
                onClick={handlePlayAll}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Play Genre Mix
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Popular Tracks */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Popular Tracks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {genre.tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContentCard
                  card={{
                    id: track.id,
                    type: 'track',
                    title: track.title,
                    subtitle: track.artist,
                    image: track.artwork,
                    tracks: [track],
                  }}
                  onClick={() => {
                    setQueue([track]);
                    setCurrentIndex(0);
                    togglePlay();
                    toast.success(`Now playing: ${track.title}`);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
