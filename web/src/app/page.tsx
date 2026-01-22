'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { usePlayer, type Track } from '@/store/player-store';
import { Section, ContentCard as ContentCardType } from '@/types/content';
import { ContentSection } from '@/components/content-section';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dial } from '@/components/ui/dial';
import { Card, CardContent } from '@/components/ui/card';
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
} from 'lucide-react';
import { Howl } from 'howler';
import WaveSurfer from 'wavesurfer.js';

// Fetch Tracks from API
const fetchTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch('/api/tracks');
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracks:', error);
    // Fallback to empty array
    return [];
  }
};

// Fetch Sections from API
const fetchSections = async (): Promise<Section[]> => {
  try {
    const response = await fetch('/api/sections');
    if (!response.ok) {
      throw new Error('Failed to fetch sections');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Home() {
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
  } = usePlayer();

  // Type definitions for Speech Recognition
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
  }

  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface WindowWithSpeechRecognition extends Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext?: typeof AudioContext;
  }

  const playerRef = useRef<Howl | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const [audioContext] = useState(() => {
    if (typeof window !== 'undefined') {
      const win = window as WindowWithSpeechRecognition;
      return new (window.AudioContext || win.webkitAudioContext || AudioContext)();
    }
    return null;
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: tracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks,
  });

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: fetchSections,
  });

  useEffect(() => {
    if (tracks) {
      setQueue(tracks);
    }
  }, [tracks, setQueue]);

  const handleCardClick = (card: ContentCardType) => {
    // Handle different card types
    if (card.type === 'track' && card.tracks) {
      // Set queue to tracks and play
      setQueue(card.tracks);
      setCurrentIndex(0);
      togglePlay();
    } else if (card.type === 'playlist' && card.tracks) {
      // Set queue to playlist tracks
      setQueue(card.tracks);
      setCurrentIndex(0);
    } else if (card.type === 'genre' || card.type === 'feature') {
      // Navigate to genre/feature page (for now, just log)
      console.log('Navigate to:', card.title, card);
      // TODO: Implement navigation to genre/feature detail page
    } else if (card.type === 'artist') {
      // Navigate to artist page
      console.log('Navigate to artist:', card.title);
      // TODO: Implement navigation to artist detail page
    }
  };

  const handleNext = useCallback(() => {
    let nextIdx = currentIndex + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    }
    if (nextIdx >= queue.length) {
      nextIdx = repeat === 'all' ? 0 : currentIndex;
    }
    setCurrentIndex(nextIdx);
  }, [currentIndex, shuffle, repeat, queue.length, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    let prevIdx = currentIndex - 1;
    if (shuffle) {
      prevIdx = Math.floor(Math.random() * queue.length);
    }
    if (prevIdx < 0) {
      prevIdx = repeat === 'all' ? queue.length - 1 : 0;
    }
    setCurrentIndex(prevIdx);
  }, [currentIndex, shuffle, repeat, queue.length, setCurrentIndex]);

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as WindowWithSpeechRecognition;
      const SpeechRecognition =
        win.webkitSpeechRecognition || win.SpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onresult = (e: SpeechRecognitionEvent) => {
          const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase();
          if (transcript.includes('play')) {
            togglePlay();
          }
          if (transcript.includes('pause')) {
            if (isPlaying) togglePlay();
          }
          if (transcript.includes('next')) {
            handleNext();
          }
          if (transcript.includes('previous') || transcript.includes('back')) {
            handlePrevious();
          }
        };

        rec.onerror = () => {
          setIsVoiceActive(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [isPlaying, togglePlay, currentIndex, shuffle, repeat, queue.length, setCurrentIndex, handleNext, handlePrevious]);

  // Initialize and manage audio player
  useEffect(() => {
    if (!queue[currentIndex]?.url || !audioContext) return;

    // Cleanup previous player
    if (playerRef.current) {
      playerRef.current.unload();
    }
    if (waveformRef.current) {
      waveformRef.current.destroy();
    }

    const howl = new Howl({
      src: [queue[currentIndex].url],
      html5: true,
      volume,
      format: ['mp3', 'opus', 'aac'],
      onload: () => {
        const trackDuration = howl.duration();
        setDuration(trackDuration);

        // Initialize WaveSurfer
        if (waveformContainerRef.current) {
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

          waveformRef.current.load(queue[currentIndex].url);
          waveformRef.current.on('ready', () => {
            if (isPlaying) {
              waveformRef.current?.play();
            }
          });

          waveformRef.current.on('seek', (progress: number) => {
            const newPosition = progress * trackDuration;
            setPosition(newPosition);
            if (howl.playing()) {
              howl.seek(newPosition);
            }
          });
        }
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

  const toggleVoiceControl = () => {
    if (recognitionRef.current) {
      if (isVoiceActive) {
        recognitionRef.current.stop();
        setIsVoiceActive(false);
      } else {
        recognitionRef.current.start();
        setIsVoiceActive(true);
      }
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
        {sections?.map((section) => (
          <ContentSection
            key={section.id}
            section={section}
            onCardClick={handleCardClick}
          />
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
