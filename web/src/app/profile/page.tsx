'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Settings,
  Award,
  TrendingUp,
  Calendar,
  Music,
  Heart,
  Zap,
  Target,
  BarChart3,
  Edit,
  Shield,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

export default function ProfilePage() {
  const { mood, vibe, sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - in production, this would come from your auth/database
  const userData = {
    name: 'User Name',
    email: 'user@example.com',
    avatar: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=User',
    joinDate: '2024-01-15',
    totalPoints: 1250,
    currentStreak: 7,
    longestStreak: 12,
    totalCheckIns: 45,
    avgMood: 72,
    avgEnergy: 68,
    isFounder: true, // Add founder status
  };

  const recentMoods = [
    { date: '2024-01-22', mood: 75, energy: 70 },
    { date: '2024-01-21', mood: 68, energy: 65 },
    { date: '2024-01-20', mood: 80, energy: 75 },
    { date: '2024-01-19', mood: 72, energy: 70 },
    { date: '2024-01-18', mood: 65, energy: 60 },
  ];

  const achievements = [
    { id: 1, name: 'First Check-In', icon: Calendar, earned: true },
    { id: 2, name: 'Week Warrior', icon: Award, earned: true },
    { id: 3, name: 'Mood Master', icon: TrendingUp, earned: true },
    { id: 4, name: 'Energy Enthusiast', icon: Zap, earned: false },
    { id: 5, name: 'Streak Champion', icon: Target, earned: false },
  ];

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6"
        >
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-32 h-32 rounded-full border-4 border-purple-500/50 object-cover"
            />
            {/* Founders Badge - Bottom Left */}
            {userData.isFounder && (
              <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-yellow-300/50">
                <Shield className="h-6 w-6 text-yellow-900 fill-yellow-200" />
              </div>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{userData.name}</h1>
              {userData.isFounder && (
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border-yellow-400/50 text-yellow-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Founder
                </Badge>
              )}
            </div>
            <p className="text-gray-400 mb-4">{userData.email}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                Joined {new Date(userData.joinDate).toLocaleDateString()}
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Award className="h-3 w-3 mr-1" />
                {userData.totalPoints} Points
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Zap className="h-3 w-3 mr-1" />
                {userData.currentStreak} Day Streak
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-white">{userData.currentStreak}</p>
                  <p className="text-xs text-gray-500 mt-1">days</p>
                </div>
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Points</p>
                  <p className="text-3xl font-bold text-white">{userData.totalPoints}</p>
                  <p className="text-xs text-gray-500 mt-1">points earned</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Mood</p>
                  <p className="text-3xl font-bold text-white">{userData.avgMood}</p>
                  <p className="text-xs text-gray-500 mt-1">out of 100</p>
                </div>
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Check-Ins</p>
                  <p className="text-3xl font-bold text-white">{userData.totalCheckIns}</p>
                  <p className="text-xs text-gray-500 mt-1">days tracked</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white/5 border-purple-500/30">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600/30">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="mood-history" className="data-[state=active]:bg-purple-600/30">
              Mood History
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600/30">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600/30">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Current Mood Settings */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Current Mood Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Energy</span>
                      <span className="text-white">{mood.energy}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${mood.energy}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Happiness</span>
                      <span className="text-white">{mood.happiness}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                        style={{ width: `${mood.happiness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Calmness</span>
                      <span className="text-white">{mood.calmness}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${mood.calmness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Intensity</span>
                      <span className="text-white">{mood.intensity}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                        style={{ width: `${mood.intensity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Vibe</span>
                      <span className="text-white">{vibe}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${vibe}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Music className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Listened to track</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-pink-600/30 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Liked a playlist</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-yellow-600/30 flex items-center justify-center">
                        <Award className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Earned achievement</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mood-history" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Mood History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMoods.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-pink-400" />
                            <span className="text-sm text-gray-400">Mood: {entry.mood}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-400">Energy: {entry.energy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            background: `linear-gradient(135deg, rgba(139, 92, 246, ${entry.mood / 100}), rgba(236, 72, 153, ${entry.energy / 100}))`,
                          }}
                        >
                          {Math.round((entry.mood + entry.energy) / 2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'bg-purple-600/20 border-purple-500/50'
                            : 'bg-white/5 border-gray-700/50 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.earned
                                ? 'bg-purple-600/30'
                                : 'bg-gray-700/30'
                            }`}
                          >
                            <Icon
                              className={`h-6 w-6 ${
                                achievement.earned ? 'text-purple-400' : 'text-gray-500'
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                achievement.earned ? 'text-white' : 'text-gray-500'
                              }`}
                            >
                              {achievement.name}
                            </p>
                            {achievement.earned && (
                              <Badge variant="secondary" className="mt-1 bg-purple-600/30 text-white text-xs">
                                Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="display-name" className="text-sm text-gray-400 mb-2 block">Display Name</label>
                  <input
                    id="display-name"
                    type="text"
                    defaultValue={userData.name}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-gray-400 mb-2 block">Email</label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={userData.email}
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="text-sm text-gray-400 mb-2 block">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
