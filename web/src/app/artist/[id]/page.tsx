'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  Play,
  Heart,
  Share2,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import Image from 'next/image';

// Mock artist data - in production, fetch from API
const mockArtist = {
  id: '1',
  name: 'The Weeknd',
  stageName: 'The Weeknd',
  bio: 'Canadian singer, songwriter, and record producer known for his dark, atmospheric R&B sound.',
  image: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Weeknd',
  followers: 125000,
  monthlyListeners: 45000,
  verified: true,
  location: 'Toronto, Canada',
  genres: ['R&B', 'Pop', 'Alternative R&B'],
  tracks: [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artwork: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Track+1',
      duration: 210,
    },
    {
      id: '2',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artwork: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Track+2',
      duration: 180,
    },
  ],
};

export default function ArtistDetailPage() {
  const params = useParams();
  const artistId = params.id as string;
  const { sidebarWidth, isSidebarCollapsed, setQueue, setCurrentIndex, togglePlay } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  // In production, fetch artist data based on artistId
  const artist = mockArtist;

  const handlePlayAll = () => {
    setQueue(artist.tracks);
    setCurrentIndex(0);
    togglePlay();
  };

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Artist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-6"
        >
          <div className="relative">
            <Image
              src={artist.image}
              alt={artist.name}
              width={240}
              height={240}
              className="w-60 h-60 rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-bold text-white">{artist.stageName}</h1>
              {artist.verified && (
                <Badge variant="secondary" className="bg-blue-600/30 text-white">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-400 mb-4">{artist.bio}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>{artist.followers.toLocaleString()} followers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span>{artist.monthlyListeners.toLocaleString()} monthly listeners</span>
              </div>
              {artist.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.location}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              {artist.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="border-purple-500/30 text-gray-300">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePlayAll}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Play All
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
              >
                <Heart className="h-5 w-5 mr-2" />
                Follow
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Popular Tracks */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5" />
              Popular Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {artist.tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="bg-white/5 border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => {
                      setQueue([track]);
                      setCurrentIndex(0);
                      togglePlay();
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 text-center text-gray-400 text-sm shrink-0">
                          {index + 1}
                        </div>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-purple-600/30 shrink-0">
                          <Image
                            src={track.artwork}
                            alt={track.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{track.title}</h3>
                          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                        </div>
                        <div className="text-sm text-gray-400 shrink-0">
                          {Math.floor(track.duration / 60)}:
                          {(track.duration % 60).toString().padStart(2, '0')}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          aria-label={`Play ${track.title}`}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
