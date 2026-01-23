'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usePlayer, type Track } from '@/store/player-store';
import { Section, ContentCard as ContentCardType } from '@/types/content';
import { ContentSection } from '@/components/content-section';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dial } from '@/components/ui/dial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Mic2,
  Shuffle,
  Repeat,
  ChevronUp,
  ChevronDown,
  Heart,
  Headphones,
  Radio,
  Trophy,
  Gift,
  Calendar,
} from 'lucide-react';
import { Howl } from 'howler';
import WaveSurfer from 'wavesurfer.js';
import { formatTime } from '@/lib/utils';
import { fetchTracks, fetchSections } from '@/lib/api';
import { useVoiceControl } from '@/hooks/use-voice-control';

export default function Home() {
  const router = useRouter();
  const {
    queue,
    currentIndex,
    isPlaying,
    volume,
    position,
    duration,
    shuffle,
    repeat,
    mood,
    vibe,
    isPlayerExpanded,
    sidebarWidth,
    isSidebarCollapsed,
    setQueue,
    setCurrentIndex,
    togglePlay,
    setVolume,
    setPosition,
    setDuration,
    toggleShuffle,
    toggleRepeat,
    setMood,
    setVibe,
    togglePlayerExpanded,
    handleNext,
    handlePrevious,
  } = usePlayer();

  const playerRef = useRef<Howl | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [audioContext] = useState(() => {
    if (typeof window !== 'undefined') {
      const win = window as import('@/types/speech').WindowWithSpeechRecognition;
      return new (window.AudioContext || win.webkitAudioContext || AudioContext)();
    }
    return null;
  });
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isVoiceActive, toggleVoiceControl } = useVoiceControl({
    isPlaying,
    togglePlay,
    onNext: handleNext,
    onPrevious: handlePrevious,
  });

  const { data: tracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => fetchTracks<Track>(),
  });

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => fetchSections<Section>(),
  });

  // Sync tracks to store when loaded
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setQueue(tracks);
    }
  }, [tracks, setQueue]);

  const handleCardClick = (card: ContentCardType) => {
    if (card.type === 'track' && card.tracks) {
      setQueue(card.tracks);
      setCurrentIndex(0);
      togglePlay();
    } else if (card.type === 'playlist' && card.tracks) {
      setQueue(card.tracks);
      setCurrentIndex(0);
    } else if (card.type === 'genre' || card.type === 'feature') {
      if (card.id === 'feature-daily-mood-checkin') router.push('/wellness/checkin');
      else if (card.id === 'feature-mood-journal') router.push('/wellness/journal');
      else if (card.id === 'feature-affirmations') router.push('/wellness/affirmations');
      // TODO: other feature/artist routes
    } else if (card.type === 'artist') {
      // TODO: router.push(`/artist/${card.id}`);
    }
  };

  // Initialize and manage audio player
  useEffect(() => {
    const currentTrack = queue[currentIndex];
    if (!currentTrack?.url || !audioContext) return;

    // Cleanup previous player
    if (playerRef.current) {
      playerRef.current.unload();
    }
    if (waveformRef.current) {
      waveformRef.current.destroy();
      waveformRef.current = null;
    }

    const trackUrl = currentTrack.url;
    const howl = new Howl({
      src: [trackUrl],
      html5: true,
      volume,
      format: ['mp3', 'opus', 'aac'],
      onload: () => {
        const trackDuration = howl.duration();
        setDuration(trackDuration);

        // Double-check that the track still exists and container is available
        const track = queue[currentIndex];
        if (!track?.url || !waveformContainerRef.current) {
          console.warn('Track or container unavailable for waveform');
          return;
        }

        // Initialize WaveSurfer
        try {
          waveformRef.current = WaveSurfer.create({
            container: waveformContainerRef.current,
            waveColor: '#a855f7',
            progressColor: '#8b5cf6',
            cursorColor: '#ffffff',
            height: 80,
            barWidth: 2,
            normalize: true,
            backend: 'WebAudio',
            mediaControls: false,
          });

          waveformRef.current.load(track.url);
          waveformRef.current.on('ready', () => {
            if (isPlaying && waveformRef.current) {
              waveformRef.current.play();
            }
          });

          waveformRef.current.on('seek', (progress: number) => {
            const newPosition = progress * trackDuration;
            setPosition(newPosition);
            if (howl.playing()) {
              howl.seek(newPosition);
            }
          });
        } catch (error) {
          console.error('Failed to initialize waveform:', error);
        }
      },
      onerror: (_id, err) => {
        console.error('Howl audio loading error:', err);
      },
      onplay: () => {
        waveformRef.current?.play();
      },
      onpause: () => {
        waveformRef.current?.pause();
      },
      onend: () => {
        handleNext();
      },
    });

    playerRef.current = howl;

    if (isPlaying) {
      howl.play();
    }

    return () => {
      if (howl) {
        howl.unload();
      }
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
    };
  }, [queue, currentIndex, audioContext, isPlaying, volume, setDuration, setPosition, repeat, handleNext]);

  // Update position
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      positionIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const pos = playerRef.current.seek() as number;
          setPosition(pos);
          if (waveformRef.current) {
            waveformRef.current.seekTo(pos / duration);
          }
        }
      }, 100);
    } else {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    }

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [isPlaying, duration, setPosition]);

  // Update volume
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      togglePlay();
    }
  };

  const handleSeek = (value: number[]) => {
    const newPosition = (value[0] / 100) * duration;
    setPosition(newPosition);
    if (playerRef.current) {
      playerRef.current.seek(newPosition);
    }
    if (waveformRef.current) {
      waveformRef.current.seekTo(newPosition / duration);
    }
  };

  const currentTrack = queue[currentIndex];
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  return (
    <main
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      {/* Hero Player */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="audio-player fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 backdrop-blur-xl border-t border-purple-500/50 shadow-2xl transition-all duration-200"
        style={{ left: `${sidebarOffset}px`, width: `calc(100% - ${sidebarOffset}px)` }}
      >
        <div className="w-full">
          {/* Expand/Collapse Toggle */}
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayerExpanded}
              className="text-white hover:bg-white/10"
            >
              {isPlayerExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main Player Controls */}
          <div className="px-6 pb-6 flex items-center gap-6 flex-wrap max-w-7xl mx-auto">
            {/* Artwork */}
            {currentTrack && (
              <Image
                src={currentTrack.artwork}
                alt={currentTrack.title}
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl shadow-lg object-cover"
                unoptimized
              />
            )}

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate text-white">
                {currentTrack?.title || 'No track selected'}
              </h2>
              <p className="text-sm text-gray-300 truncate">
                {currentTrack?.artist || ''}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShuffle}
                className={shuffle ? 'text-purple-400' : ''}
              >
                <Shuffle className={`h-5 w-5 ${shuffle ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                <SkipForward className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRepeat}
                className={repeat !== 'none' ? 'text-purple-400' : ''}
              >
                <Repeat
                  className={`h-5 w-5 ${repeat === 'one' ? 'fill-current' : ''}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceControl}
                className={isVoiceActive ? 'text-blue-400' : ''}
              >
                <Mic2 className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-white" />
                <Slider
                  className="w-32"
                  value={[volume * 100]}
                  onValueChange={([v]) => setVolume(v / 100)}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm text-gray-300 whitespace-nowrap">
                {formatTime(position)}
              </span>
              <Slider
                className="flex-1 md:w-48"
                value={duration > 0 ? [(position / duration) * 100] : [0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
              />
              <span className="text-sm text-gray-300 whitespace-nowrap">
                {formatTime(duration)}
              </span>
            </div>

            {/* Waveform Viz */}
            <div
              ref={waveformContainerRef}
              className="w-full md:w-64 h-20 bg-black/50 rounded-lg overflow-hidden"
            />
          </div>

          {/* Expanded Mood Controls */}
          <AnimatePresence>
            {isPlayerExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-purple-500/30"
              >
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Mood Sliders */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">
                      Energy
                    </label>
                    <Slider
                      value={[mood.energy]}
                      onValueChange={([v]) => setMood({ energy: v })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{mood.energy}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">
                      Happiness
                    </label>
                    <Slider
                      value={[mood.happiness]}
                      onValueChange={([v]) => setMood({ happiness: v })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{mood.happiness}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">
                      Calmness
                    </label>
                    <Slider
                      value={[mood.calmness]}
                      onValueChange={([v]) => setMood({ calmness: v })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{mood.calmness}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">
                      Intensity
                    </label>
                    <Slider
                      value={[mood.intensity]}
                      onValueChange={([v]) => setMood({ intensity: v })}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{mood.intensity}</span>
                  </div>

                  {/* Vibe Dial */}
                  <div className="flex items-center justify-center">
                    <Dial
                      value={vibe}
                      onChange={setVibe}
                      min={0}
                      max={100}
                      size={100}
                      label="Vibe"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="pt-8 space-y-8">
        {sections?.map((section, index) => (
          <div key={section.id}>
            {/* Messages from Michelle Card - Above Mood & Wellness */}
            {section.id === 'mood-wellness' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between px-2 mb-4">
                  <h2 className="text-2xl font-bold text-white">Messages from Michelle</h2>
                </div>
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                    <div className="flex gap-4 pb-4">
                      {/* Messages from Michelle Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="shrink-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-black border-2 border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center bg-black">
                                {/* Logo with Headphones Image */}
                                <Image
                                  src="/empulse-logo-headphones.png"
                                  alt="EmPulse Logo with Headphones"
                                  fill
                                  className="object-contain p-4"
                                  unoptimized
                                />
                              </div>
                              <div className="p-3 space-y-1">
                                <h3 className="font-semibold line-clamp-1 text-white text-sm">
                                  Messages from Michelle
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  Updates from the EmPulse team
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>

                      {/* Live Events Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="shrink-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-black border-2 border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center bg-black">
                                <Image
                                  src="/empulse-logo-headphones.png"
                                  alt="Live Events"
                                  fill
                                  className="object-contain p-4"
                                  unoptimized
                                />
                              </div>
                              <div className="p-3 space-y-1">
                                <h3 className="font-semibold line-clamp-1 text-white text-sm">
                                  Live Events
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  Upcoming concerts & shows
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>

                      {/* Streaming Events Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="shrink-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-black border-2 border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center bg-black">
                                <Image
                                  src="/empulse-logo-headphones.png"
                                  alt="Streaming Events"
                                  fill
                                  className="object-contain p-4"
                                  unoptimized
                                />
                              </div>
                              <div className="p-3 space-y-1">
                                <h3 className="font-semibold line-clamp-1 text-white text-sm">
                                  Streaming Events
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  Live streams & sessions
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>

                      {/* Contests Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="shrink-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-black border-2 border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center bg-black">
                                <Image
                                  src="/empulse-logo-headphones.png"
                                  alt="Contests"
                                  fill
                                  className="object-contain p-4"
                                  unoptimized
                                />
                              </div>
                              <div className="p-3 space-y-1">
                                <h3 className="font-semibold line-clamp-1 text-white text-sm">
                                  Contests
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  Win prizes & rewards
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>

                      {/* Promotions Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="shrink-0"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-black border-2 border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center bg-black">
                                <Image
                                  src="/empulse-logo-headphones.png"
                                  alt="Promotions"
                                  fill
                                  className="object-contain p-4"
                                  unoptimized
                                />
                              </div>
                              <div className="p-3 space-y-1">
                                <h3 className="font-semibold line-clamp-1 text-white text-sm">
                                  Promotions
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  Special offers & deals
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <ContentSection
              section={section}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </div>

      {/* Voice Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed top-4 right-4 z-40 bg-purple-600 hover:bg-purple-700">
            <Mic2 className="h-4 w-4 mr-2" />
            Voice Queue
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Voice Commands</h3>
            <div className="space-y-2 text-gray-300">
              <p>Say &quot;play&quot; to play/pause</p>
              <p>Say &quot;next&quot; to skip to next track</p>
              <p>Say &quot;previous&quot; or &quot;back&quot; to go back</p>
              <p>Say &quot;pause&quot; to pause</p>
            </div>
            <div className="mt-4">
              <Badge variant={isVoiceActive ? 'default' : 'secondary'}>
                {isVoiceActive ? 'Voice Active' : 'Voice Inactive'}
              </Badge>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
