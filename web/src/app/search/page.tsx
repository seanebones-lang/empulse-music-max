'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search as SearchIcon,
  Music,
  Users,
  Radio,
  Play,
  Heart,
  MoreVertical,
  Filter,
  X,
  TrendingUp,
} from 'lucide-react';
import { usePlayer, type Track } from '@/store/player-store';
import { SearchResultsSkeleton } from '@/components/skeleton-loader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Fetch all tracks for search
const fetchAllTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch('/api/tracks');
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    return await response.json();
  } catch (error) {
    // Error will be handled by React Query's error state
    return [];
  }
};

// Mock artists data
const mockArtists = [
  { id: '1', name: 'The Weeknd', followers: 125000, image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Weeknd' },
  { id: '2', name: 'Post Malone', followers: 98000, image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Post' },
  { id: '3', name: 'Billie Eilish', followers: 150000, image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Billie' },
  { id: '4', name: 'Dua Lipa', followers: 110000, image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Dua' },
  { id: '5', name: 'The Midnight Echoes', followers: 25000, image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Echoes' },
];

// Mock playlists data
const mockPlaylists = [
  { id: '1', title: 'Today\'s Top Hits', description: 'The most played songs right now', trackCount: 50, image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Top+Hits' },
  { id: '2', title: 'Discover Weekly', description: 'Your weekly mixtape', trackCount: 30, image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Discover' },
  { id: '3', title: 'Mood Mix', description: 'Based on your mood settings', trackCount: 25, image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Mood' },
  { id: '4', title: 'Chill Vibes', description: 'Relax and unwind', trackCount: 40, image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Chill' },
];

// Mock genres
const mockGenres = [
  { id: 'hiphop', name: 'Hip-Hop/Rap', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { id: 'pop', name: 'Pop', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'rock', name: 'Rock', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'electronic', name: 'Electronic/EDM', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'rnb', name: 'R&B/Soul', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 'country', name: 'Country', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
];

export default function SearchPage() {
  const router = useRouter();
  const { sidebarWidth, isSidebarCollapsed, setQueue, setCurrentIndex, togglePlay } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: tracks = [], isLoading: tracksLoading, error: tracksError } = useQuery({
    queryKey: ['allTracks'],
    queryFn: fetchAllTracks,
  });

  // Filter tracks based on search query and genre
  const filteredTracks = useMemo(() => {
    let filtered = tracks;
    
    // Apply genre filter if selected (when no search query)
    if (selectedGenre && !searchQuery.trim()) {
      // TODO: Filter tracks by genre when genre data is available
      // For now, genre filter is visual only
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tracks, searchQuery, selectedGenre]);

  // Filter artists (memoized for performance)
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return mockArtists;
    const query = searchQuery.toLowerCase().trim();
    return mockArtists.filter((artist) => artist.name.toLowerCase().includes(query));
  }, [searchQuery]);

  // Filter playlists (memoized for performance)
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return mockPlaylists;
    const query = searchQuery.toLowerCase().trim();
    return mockPlaylists.filter(
      (playlist) =>
        playlist.title.toLowerCase().includes(query) ||
        playlist.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleTrackClick = (track: Track) => {
    setQueue([track]);
    setCurrentIndex(0);
    togglePlay();
    toast.success(`Now playing: ${track.title}`);
  };

  const handlePlaylistClick = (playlist: typeof mockPlaylists[0]) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handleArtistClick = (artist: typeof mockArtists[0]) => {
    router.push(`/artist/${artist.id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre(null);
  };

  const hasResults =
    filteredTracks.length > 0 ||
    filteredArtists.length > 0 ||
    filteredPlaylists.length > 0;

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <SearchIcon className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Search</h1>
          </div>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for songs, artists, playlists, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Genre Filters */}
          {!searchQuery && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Browse by genre:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockGenres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="outline"
                    className={`cursor-pointer border transition-all ${
                      selectedGenre === genre.id
                        ? genre.color + ' border-opacity-100'
                        : 'bg-white/5 text-gray-400 border-gray-500/30 hover:border-gray-500/50'
                    }`}
                    onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {tracksLoading && (
          <div className="py-12">
            <SearchResultsSkeleton />
          </div>
        )}

        {/* Error State */}
        {tracksError && !tracksLoading && (
          <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/30">
            <CardContent className="p-12 text-center">
              <p className="text-red-400 font-semibold mb-2">Failed to load tracks</p>
              <p className="text-sm text-gray-400">Please try again later</p>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {!tracksLoading && !tracksError && searchQuery ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white/5 border-purple-500/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600/30">
                All
              </TabsTrigger>
              <TabsTrigger value="tracks" className="data-[state=active]:bg-purple-600/30">
                Songs ({filteredTracks.length})
              </TabsTrigger>
              <TabsTrigger value="artists" className="data-[state=active]:bg-purple-600/30">
                Artists ({filteredArtists.length})
              </TabsTrigger>
              <TabsTrigger value="playlists" className="data-[state=active]:bg-purple-600/30">
                Playlists ({filteredPlaylists.length})
              </TabsTrigger>
            </TabsList>

            {hasResults ? (
              <>
                <TabsContent value="all" className="space-y-6">
                  {/* Tracks */}
                  {filteredTracks.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
                      <div className="space-y-2">
                        {filteredTracks.slice(0, 5).map((track) => (
                          <motion.div
                            key={track.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <Card
                              className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                              onClick={() => handleTrackClick(track)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-600/30 flex items-center justify-center shrink-0">
                                    <Image
                                      src={track.artwork}
                                      alt={track.title}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{track.title}</h3>
                                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/10"
                                  >
                                    <Play className="h-5 w-5" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                        {filteredTracks.length > 5 && (
                          <Button
                            variant="ghost"
                            className="w-full text-purple-400 hover:text-purple-300"
                            onClick={() => setActiveTab('tracks')}
                          >
                            View all {filteredTracks.length} songs
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Artists */}
                  {filteredArtists.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredArtists.slice(0, 6).map((artist) => (
                          <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <Card
                              className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                              onClick={() => handleArtistClick(artist)}
                            >
                              <CardContent className="p-4 text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-purple-600/30 mb-3 overflow-hidden">
                                  <Image
                                    src={artist.image}
                                    alt={artist.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h3 className="font-semibold text-white text-sm truncate">{artist.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{artist.followers.toLocaleString()} followers</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Playlists */}
                  {filteredPlaylists.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredPlaylists.slice(0, 6).map((playlist) => (
                          <motion.div
                            key={playlist.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <Card
                              className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                              onClick={() => handlePlaylistClick(playlist)}
                            >
                              <CardContent className="p-0">
                                <div className="w-full aspect-square relative bg-purple-600/30">
                                  <Image
                                    src={playlist.image}
                                    alt={playlist.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="p-3">
                                  <h3 className="font-semibold text-white text-sm line-clamp-1">{playlist.title}</h3>
                                  <p className="text-xs text-gray-400 mt-1">{playlist.trackCount} tracks</p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tracks" className="space-y-2">
                  {filteredTracks.map((track) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card
                        className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                        onClick={() => handleTrackClick(track)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-600/30 flex items-center justify-center shrink-0">
                              <Image
                                src={track.artwork}
                                alt={track.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate">{track.title}</h3>
                              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10"
                              aria-label={`Play ${track.title}`}
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="artists" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredArtists.map((artist) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card
                          className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                          onClick={() => handleArtistClick(artist)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-24 h-24 mx-auto rounded-full bg-purple-600/30 mb-3 overflow-hidden">
                              <Image
                                src={artist.image}
                                alt={artist.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-white text-sm truncate">{artist.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{artist.followers.toLocaleString()} followers</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="playlists" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredPlaylists.map((playlist) => (
                      <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card
                          className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
                          onClick={() => handlePlaylistClick(playlist)}
                        >
                          <CardContent className="p-0">
                            <div className="w-full aspect-square relative bg-purple-600/30">
                              <Image
                                src={playlist.image}
                                alt={playlist.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-white text-sm line-clamp-1">{playlist.title}</h3>
                              <p className="text-xs text-gray-400 mt-1">{playlist.trackCount} tracks</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </>
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <SearchIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
                </CardContent>
              </Card>
            )}
          </Tabs>
        ) : !tracksLoading && !tracksError ? (
          /* Browse View - When no search query */
          <div className="space-y-8">
            {/* Trending Searches */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {['The Weeknd', 'Pop Music', 'Chill Vibes', 'Workout Mix', 'Study Focus', 'Relaxation'].map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer bg-white/5 text-gray-300 border-gray-500/30 hover:border-purple-500/50 hover:text-white px-4 py-2"
                    onClick={() => setSearchQuery(term)}
                  >
                    <TrendingUp className="h-3 w-3 mr-2" />
                    {term}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Browse by Genre */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Browse by Genre</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockGenres.map((genre) => (
                  <motion.div
                    key={genre.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`${genre.color} border cursor-pointer w-48 h-48 flex flex-col items-center justify-center`}
                      onClick={() => setSelectedGenre(genre.id)}
                    >
                      <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                        <Radio className="h-8 w-8 mb-3" />
                        <h3 className="font-semibold">{genre.name}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Artists */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Popular Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockArtists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer w-48 h-48"
                      onClick={() => handleArtistClick(artist)}
                    >
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
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
