'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Music,
  Volume2,
  Moon,
  Sun,
  Globe,
  Shield,
  Download,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

export default function SettingsPage() {
  const { sidebarWidth, isSidebarCollapsed, volume, setVolume } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    checkinReminders: true,
    streakUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showListeningActivity: true,
    showMoodData: false,
  });

  const [audioSettings] = useState({
    crossfade: 2,
    normalizeVolume: true,
    highQuality: true,
  });

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <SettingsIcon className="h-10 w-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </motion.div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="bg-white/5 border-purple-500/30">
            <TabsTrigger value="account" className="data-[state=active]:bg-purple-600/30">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600/30">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-purple-600/30">
              <Music className="h-4 w-4 mr-2" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600/30">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Your Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Check-in Reminders</p>
                    <p className="text-sm text-gray-400">Daily reminders for mood check-ins</p>
                  </div>
                  <Switch
                    checked={notifications.checkinReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, checkinReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Streak Updates</p>
                    <p className="text-sm text-gray-400">Notifications about your streaks</p>
                  </div>
                  <Switch
                    checked={notifications.streakUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, streakUpdates: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Volume & Playback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Volume</label>
                    <span className="text-sm text-white">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([v]) => setVolume(v / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Normalize Volume</p>
                    <p className="text-sm text-gray-400">Automatically adjust volume between tracks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">High Quality Streaming</p>
                    <p className="text-sm text-gray-400">Stream at highest quality (uses more data)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Profile Visibility
                  </label>
                  <select 
                    className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    aria-label="Profile visibility setting"
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Show Listening Activity</p>
                    <p className="text-sm text-gray-400">Let others see what you're listening to</p>
                  </div>
                  <Switch
                    checked={privacy.showListeningActivity}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showListeningActivity: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Show Mood Data</p>
                    <p className="text-sm text-gray-400">Share your mood check-in data (anonymized)</p>
                  </div>
                  <Switch
                    checked={privacy.showMoodData}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showMoodData: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
