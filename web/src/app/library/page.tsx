'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Library,
  Music,
  Heart,
  Play,
  Clock,
  Plus,
  Search,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Edit,
  Filter,
  Grid3x3,
  List,
  Users,
} from 'lucide-react';
import { usePlayer, type Track } from '@/store/player-store';
import { TrackSkeleton, CardSkeleton } from '@/components/skeleton-loader';
import { toast } from 'sonner';
import Image from 'next/image';

// Use shared API utility
import { fetchTracks } from '@/lib/api';
import { useLikedTracks } from '@/hooks/use-like-track';
import { LikeButton } from '@/components/like-button';

// Mock library data
const mockLikedSongs: Track[] = [
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
];

const mockPlaylists = [
  {
    id: '1',
    name: 'Liked Songs',
    description: '125 songs you love',
    image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Liked',
    trackCount: 125,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Favorites',
    description: 'Your favorite tracks',
    image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Favorites',
    trackCount: 42,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Recently Played',
    description: 'Tracks you\'ve been listening to',
    image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Recent',
    trackCount: 89,
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Workout Mix',
    description: 'High energy tracks',
    image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Workout',
    trackCount: 35,
    createdAt: '2024-01-18',
  },
  {
    id: '5',
    name: 'Chill Vibes',
    description: 'Relax and unwind',
    image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Chill',
    trackCount: 28,
    createdAt: '2024-01-12',
  },
];

const mockArtists = [
  { id: '1', name: 'The Weeknd', image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Weeknd', followers: 125000 },
  { id: '2', name: 'Post Malone', image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Post', followers: 98000 },
  { id: '3', name: 'Billie Eilish', image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Billie', followers: 150000 },
];

const mockAlbums = [
  { id: '1', title: 'After Hours', artist: 'The Weeknd', image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=After+Hours', trackCount: 14 },
  { id: '2', title: 'Hollywood\'s Bleeding', artist: 'Post Malone', image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=HB', trackCount: 17 },
  { id: '3', title: 'Happier Than Ever', artist: 'Billie Eilish', image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=HTE', trackCount: 16 },
];

export default function LibraryPage() {
  const { sidebarWidth, isSidebarCollapsed, setQueue, setCurrentIndex, togglePlay } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [activeTab, setActiveTab] = useState('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tracks = [], isLoading: tracksLoading, error: tracksError } = useQuery({
    queryKey: ['libraryTracks'],
    queryFn: () => fetchTracks<Track>(),
  });

  // Fetch liked tracks for authenticated users
  const { data: likedTracks = [], isLoading: likedTracksLoading } = useLikedTracks();
  
  // Edge case: Ensure arrays are defined and use liked tracks if available, otherwise use all tracks
  const displayTracks = (Array.isArray(likedTracks) && likedTracks.length > 0) 
    ? likedTracks 
    : (Array.isArray(tracks) ? tracks : []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track) => {
    // Edge case: Validate track exists
    if (!track || !track.id) {
      toast.error('Invalid track');
      return;
    }
    
    setQueue([track]);
    setCurrentIndex(0);
    togglePlay();
    toast.success(`Now playing: ${track.title || 'Track'}`);
  };

  const handlePlayPlaylist = (playlist: typeof mockPlaylists[0]) => {
    // TODO: Fetch playlist tracks and play
    // For now, use display tracks if available
    // Edge case: Check array exists and has items
    if (Array.isArray(displayTracks) && displayTracks.length > 0) {
      setQueue(displayTracks);
      setCurrentIndex(0);
      togglePlay();
      toast.success(`Now playing: ${playlist.name}`);
    } else {
      toast.error('No tracks available to play');
    }
  };

  // Memoized filtered results for better performance
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return mockPlaylists;
    const query = searchQuery.toLowerCase().trim();
    return mockPlaylists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(query) ||
        playlist.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return mockArtists;
    const query = searchQuery.toLowerCase().trim();
    return mockArtists.filter((artist) => artist.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return mockAlbums;
    const query = searchQuery.toLowerCase().trim();
    return mockAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Library className="h-10 w-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Your Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
              aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500"
          />
        </div>

        {/* Loading State */}
        {(tracksLoading || likedTracksLoading) && (
          <div className="py-12 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {tracksError && !tracksLoading && !likedTracksLoading && (
          <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/30">
            <CardContent className="p-12 text-center">
              <p className="text-red-400 font-semibold mb-2">Failed to load library</p>
              <p className="text-sm text-gray-400">Please try again later</p>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        {!tracksLoading && !tracksError && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/5 border-purple-500/30">
            <TabsTrigger value="playlists" className="data-[state=active]:bg-purple-600/30">
              Playlists
            </TabsTrigger>
            <TabsTrigger value="liked" className="data-[state=active]:bg-purple-600/30">
              Liked Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="data-[state=active]:bg-purple-600/30">
              Artists
            </TabsTrigger>
            <TabsTrigger value="albums" className="data-[state=active]:bg-purple-600/30">
              Albums
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-purple-600/30">
              Recently Played
            </TabsTrigger>
          </TabsList>

          {/* Playlists Tab */}
          <TabsContent value="playlists" className="space-y-4">
            {filteredPlaylists.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredPlaylists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card
                        className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer w-48 h-48"
                        onClick={() => handlePlayPlaylist(playlist)}
                      >
                        <CardContent className="p-0 h-full relative flex flex-col items-center justify-center">
                          <div className="absolute inset-0">
                            <Image
                              src={playlist.image}
                              alt={playlist.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                            <Button
                              size="icon"
                              className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPlaylist(playlist);
                              }}
                            >
                              <Play className="h-6 w-6" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-center z-10">
                            <h3 className="font-semibold text-white text-sm line-clamp-1">{playlist.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{playlist.trackCount} tracks</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPlaylists.map((playlist) => (
                    <Card
                      key={playlist.id}
                      className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                      onClick={() => handlePlayPlaylist(playlist)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-600/30 shrink-0">
                            <Image
                              src={playlist.image}
                              alt={playlist.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                            <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">{playlist.trackCount} tracks</p>
                            <p className="text-xs text-gray-500">
                              Created {new Date(playlist.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPlaylist(playlist);
                            }}
                          >
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No playlists found</p>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      // TODO: Create playlist
                      // Open playlist creation dialog when implemented
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Playlist
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Liked Songs Tab */}
          <TabsContent value="liked" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Liked Songs</h2>
                  <p className="text-gray-400 mt-1">
                    {displayTracks.length} {displayTracks.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  if (displayTracks.length > 0) {
                    setQueue(displayTracks);
                    setCurrentIndex(0);
                    togglePlay();
                  }
                }}
                disabled={displayTracks.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Play All
              </Button>
            </div>

            <div className="space-y-2">
              {displayTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => handlePlayTrack(track)}
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
                          {formatDuration(track.duration)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                        <LikeButton
                          trackId={track.id}
                          size="sm"
                          variant="ghost"
                          className="shrink-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Show menu with more options
                          }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-4">
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredArtists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer w-48 h-48">
                      <CardContent className="p-0 h-full flex flex-col items-center justify-center relative">
                        <div className="absolute inset-0">
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>
                        <div className="relative z-10 text-center px-3">
                          <div className="w-20 h-20 mx-auto rounded-full bg-purple-600/30 mb-3 overflow-hidden border-2 border-white/20">
                            <Image
                              src={artist.image}
                              alt={artist.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-white text-sm truncate">{artist.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{artist.followers.toLocaleString()} followers</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No artists in your library</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-4">
            {filteredAlbums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredAlbums.map((album) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer w-48 h-48">
                      <CardContent className="p-0 h-full relative flex flex-col items-center justify-center">
                        <div className="absolute inset-0">
                          <Image
                            src={album.image}
                            alt={album.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <Button
                            size="icon"
                            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-center z-10">
                          <h3 className="font-semibold text-white text-sm line-clamp-1">{album.title}</h3>
                          <p className="text-xs text-gray-400 mt-1 truncate">{album.artist}</p>
                          <p className="text-xs text-gray-500 mt-1">{album.trackCount} tracks</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No albums in your library</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recently Played Tab */}
          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-2">
              {displayTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
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
                          <span>2 hours ago</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
