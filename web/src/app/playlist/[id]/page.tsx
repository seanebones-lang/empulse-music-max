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
  MoreVertical,
  Clock,
  Users,
} from 'lucide-react';
import { usePlayer, type Track } from '@/store/player-store';
import { toast } from 'sonner';
import Image from 'next/image';

// Mock playlist data - in production, fetch from API
const mockPlaylist = {
  id: '1',
  name: 'Today\'s Top Hits',
  description: 'The most played songs right now',
  image: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Top+Hits',
  owner: 'EmPulse',
  followers: 125000,
  tracks: [
    {
      id: '1',
      title: 'EmPulse Beat 1',
      artist: 'RE Artist',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artwork: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Track+1',
      duration: 210,
    },
    {
      id: '2',
      title: 'Max Groove',
      artist: 'AI Mix',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artwork: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Track+2',
      duration: 180,
    },
    {
      id: '3',
      title: 'Ultra Wave',
      artist: 'Digital Dreams',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      artwork: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Track+3',
      duration: 195,
    },
  ],
};

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const { sidebarWidth, isSidebarCollapsed, setQueue, setCurrentIndex, togglePlay } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  // In production, fetch playlist data based on playlistId
  const playlist = mockPlaylist;

  const totalDuration = playlist.tracks.reduce((sum, track) => sum + track.duration, 0);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAll = () => {
    setQueue(playlist.tracks);
    setCurrentIndex(0);
    togglePlay();
    toast.success(`Now playing: ${playlist.name}`);
  };

  const handlePlayTrack = (track: Track, index: number) => {
    setQueue(playlist.tracks);
    setCurrentIndex(index);
    togglePlay();
    toast.success(`Now playing: ${track.title}`);
  };

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Playlist Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-6"
        >
          <div className="relative">
            <Image
              src={playlist.image}
              alt={playlist.name}
              width={240}
              height={240}
              className="w-60 h-60 rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-2">{playlist.name}</h1>
            <p className="text-gray-400 mb-4">{playlist.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
              <span className="font-semibold text-white">{playlist.owner}</span>
              <span>•</span>
              <span>{playlist.tracks.length} songs</span>
              <span>•</span>
              <span>{formatDuration(totalDuration)}</span>
              {playlist.followers > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{playlist.followers.toLocaleString()} followers</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePlayAll}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Play
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

        {/* Tracks List */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5" />
              Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {playlist.tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="bg-white/5 border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => handlePlayTrack(track, index)}
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
                        <div className="flex items-center gap-2 text-sm text-gray-400 shrink-0">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(track.duration)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track, index);
                          }}
                          aria-label={`Play ${track.title}`}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          aria-label={`More options for ${track.title}`}
                        >
                          <MoreVertical className="h-5 w-5" />
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
