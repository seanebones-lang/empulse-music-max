'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  TrendingUp,
  Flame,
  Award,
  Sparkles,
  Filter,
  Download,
  BarChart3,
  Heart,
  Zap,
  Wind,
  Smile,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

// Mock check-in history data
const mockCheckIns = [
  {
    id: '1',
    date: '2024-01-22',
    mood: { energy: 75, happiness: 80, calmness: 70, intensity: 65 },
    tags: ['excited', 'motivated', 'grateful'],
    journalNote: 'Feeling great today! Had an amazing workout and feeling energized.',
    points: 21,
  },
  {
    id: '2',
    date: '2024-01-21',
    mood: { energy: 60, happiness: 65, calmness: 75, intensity: 50 },
    tags: ['calm', 'peaceful'],
    journalNote: 'Peaceful day, took time to relax and reflect.',
    points: 19,
  },
  {
    id: '3',
    date: '2024-01-20',
    mood: { energy: 85, happiness: 90, calmness: 60, intensity: 80 },
    tags: ['excited', 'motivated', 'grateful', 'peaceful'],
    journalNote: 'Incredible day! Everything is going well.',
    points: 23,
  },
  {
    id: '4',
    date: '2024-01-19',
    mood: { energy: 50, happiness: 55, calmness: 65, intensity: 45 },
    tags: ['tired', 'stressed'],
    journalNote: 'Feeling a bit overwhelmed, but taking it one step at a time.',
    points: 19,
  },
  {
    id: '5',
    date: '2024-01-18',
    mood: { energy: 70, happiness: 75, calmness: 70, intensity: 60 },
    tags: ['grateful', 'calm'],
    journalNote: '',
    points: 14,
  },
];

const filterOptions = ['All', 'Week', 'Month', 'Year'];

export default function MoodJournalPage() {
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);

  // Mock user stats
  const userStats = {
    currentStreak: 7,
    longestStreak: 12,
    totalPoints: 1250,
    totalCheckIns: 45,
    avgMood: 72,
    avgEnergy: 68,
  };

  const getFilteredCheckIns = () => {
    const now = new Date();
    const filtered = mockCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.date);
      switch (selectedFilter) {
        case 'Week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return checkInDate >= weekAgo;
        case 'Month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return checkInDate >= monthAgo;
        case 'Year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return checkInDate >= yearAgo;
        default:
          return true;
      }
    });
    return filtered;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      grateful: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      anxious: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      excited: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      calm: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      tired: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      motivated: 'bg-green-500/20 text-green-300 border-green-500/30',
      stressed: 'bg-red-500/20 text-red-300 border-red-500/30',
      peaceful: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[tag] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon!');
  };

  const filteredCheckIns = getFilteredCheckIns();

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
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-10 w-10 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Mood Journal & History</h1>
            </div>
            <p className="text-lg text-gray-400">View your past check-ins and track your progress</p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Current Streak</p>
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userStats.currentStreak}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Longest Streak</p>
                <Award className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userStats.longestStreak}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Total Points</p>
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userStats.totalPoints}</p>
              <p className="text-xs text-gray-500 mt-1">earned</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Total Check-Ins</p>
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userStats.totalCheckIns}</p>
              <p className="text-xs text-gray-500 mt-1">days tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Average Mood Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Average Mood</p>
                <Smile className="h-5 w-5 text-pink-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">{userStats.avgMood}</p>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  style={{ width: `${userStats.avgMood}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Average Energy</p>
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">{userStats.avgEnergy}</p>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${userStats.avgEnergy}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/5 border-purple-500/30">
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-600/30">
                History
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600/30">
                Statistics
              </TabsTrigger>
            </TabsList>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              {filterOptions.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={
                    selectedFilter === filter
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border-purple-500/30 bg-white/5 text-white hover:bg-white/10'
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="history" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCheckIns.length > 0 ? (
                filteredCheckIns.map((checkIn) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      className={`bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer ${
                        selectedCheckIn === checkIn.id ? 'border-purple-500' : ''
                      }`}
                      onClick={() =>
                        setSelectedCheckIn(selectedCheckIn === checkIn.id ? null : checkIn.id)
                      }
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {formatDate(checkIn.date)}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>Energy: {checkIn.mood.energy}</span>
                              <span>Happiness: {checkIn.mood.happiness}</span>
                              <span>Calmness: {checkIn.mood.calmness}</span>
                              <span>Intensity: {checkIn.mood.intensity}</span>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            +{checkIn.points} pts
                          </Badge>
                        </div>

                        {/* Tags */}
                        {checkIn.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {checkIn.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className={`${getTagColor(tag)} border text-xs`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Journal Note - Expandable */}
                        {checkIn.journalNote && (
                          <div className="mt-4 pt-4 border-t border-purple-500/30">
                            {selectedCheckIn === checkIn.id ? (
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {checkIn.journalNote}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {checkIn.journalNote}
                              </p>
                            )}
                            {checkIn.journalNote.length > 100 && (
                              <button
                                className="text-xs text-purple-400 hover:text-purple-300 mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCheckIn(selectedCheckIn === checkIn.id ? null : checkIn.id);
                                }}
                              >
                                {selectedCheckIn === checkIn.id ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No check-ins found for this period</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>Chart visualization coming soon</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">High (80-100)</span>
                        <span className="text-white">12 days</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '27%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Medium (50-79)</span>
                        <span className="text-white">28 days</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '62%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Low (0-49)</span>
                        <span className="text-white">5 days</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '11%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Most Common Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { tag: 'Grateful', count: 18, color: 'bg-yellow-500' },
                      { tag: 'Calm', count: 15, color: 'bg-blue-500' },
                      { tag: 'Motivated', count: 12, color: 'bg-green-500' },
                      { tag: 'Excited', count: 10, color: 'bg-pink-500' },
                      { tag: 'Peaceful', count: 8, color: 'bg-purple-500' },
                    ].map((item) => (
                      <div key={item.tag} className="flex items-center justify-between">
                        <span className="text-gray-300">{item.tag}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color}`}
                              style={{ width: `${(item.count / 18) * 100}%` }}
                            />
                          </div>
                          <span className="text-white text-sm w-8 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
