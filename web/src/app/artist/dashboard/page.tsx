'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  DollarSign,
  Music,
  Upload,
  BarChart3,
  Calendar,
  Award,
  Play,
  Heart,
  Share2,
  Download,
  Edit,
  Settings,
  Wallet,
  Eye,
  Clock,
  Shield,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { Switch } from '@/components/ui/switch';

export default function ArtistDashboard() {
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  // Mock artist data - in production, this would come from your auth/database
  const artistData = {
    name: 'Artist Name',
    stageName: 'Stage Name',
    email: 'artist@example.com',
    avatar: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=Artist',
    joinDate: '2024-01-15',
    verified: true,
    isFounder: true, // Add founder status
    followers: 12500,
    monthlyListeners: 45000,
    totalStreams: 1250000,
    totalEarnings: 12500.50,
    thisMonthEarnings: 1250.75,
  };

  const stats = [
    {
      label: 'Total Streams',
      value: '1.25M',
      change: '+12.5%',
      trend: 'up',
      icon: Play,
      color: 'text-blue-400',
    },
    {
      label: 'Monthly Listeners',
      value: '45K',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-400',
    },
    {
      label: 'Followers',
      value: '12.5K',
      change: '+5.1%',
      trend: 'up',
      icon: Heart,
      color: 'text-pink-400',
    },
    {
      label: 'This Month Earnings',
      value: `$${artistData.thisMonthEarnings.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400',
    },
  ];

  const [tracks, setTracks] = useState([
    {
      id: '1',
      title: 'Hit Song 1',
      streams: 450000,
      listeners: 12500,
      revenue: 450.00,
      releaseDate: '2024-01-10',
      status: 'published',
    },
    {
      id: '2',
      title: 'Popular Track 2',
      streams: 320000,
      listeners: 9800,
      revenue: 320.00,
      releaseDate: '2024-01-05',
      status: 'published',
    },
    {
      id: '3',
      title: 'New Release',
      streams: 125000,
      listeners: 4500,
      revenue: 125.00,
      releaseDate: '2024-01-20',
      status: 'published',
    },
    {
      id: '4',
      title: 'Draft Track',
      streams: 0,
      listeners: 0,
      revenue: 0,
      releaseDate: null,
      status: 'draft',
    },
  ]);

  const toggleTrackStatus = (trackId: string) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id === trackId) {
          const newStatus = track.status === 'published' ? 'unpublished' : 'published';
          // TODO: Call API to update track status
          console.log(`Updating track ${trackId} to ${newStatus}`);
          return { ...track, status: newStatus };
        }
        return track;
      })
    );
  };

  const recentActivity = [
    { type: 'stream', message: 'Track "Hit Song 1" reached 450K streams', time: '2 hours ago' },
    { type: 'follower', message: 'Gained 25 new followers', time: '5 hours ago' },
    { type: 'payout', message: 'Monthly payout processed: $1,250.75', time: '1 day ago' },
    { type: 'upload', message: 'New track "New Release" published', time: '2 days ago' },
  ];

  const payoutHistory = [
    { date: '2024-01-01', amount: 1250.75, status: 'paid' },
    { date: '2023-12-01', amount: 1100.50, status: 'paid' },
    { date: '2023-11-01', amount: 980.25, status: 'paid' },
  ];

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
          className="flex flex-col md:flex-row items-start md:items-center gap-6"
        >
          <div className="relative">
            <img
              src={artistData.avatar}
              alt={artistData.name}
              className="w-32 h-32 rounded-full border-4 border-purple-500/50 object-cover"
            />
            {artistData.verified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
            )}
            {/* Founders Badge - Bottom Left */}
            {artistData.isFounder && (
              <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-yellow-300/50">
                <Shield className="h-6 w-6 text-yellow-900 fill-yellow-200" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{artistData.stageName}</h1>
              {artistData.verified && (
                <Badge variant="secondary" className="bg-blue-600/30 text-white">
                  Verified Artist
                </Badge>
              )}
              {artistData.isFounder && (
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border-yellow-400/50 text-yellow-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Founder
                </Badge>
              )}
            </div>
            <p className="text-gray-400 mb-4">{artistData.email}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Users className="h-3 w-3 mr-1" />
                {artistData.followers.toLocaleString()} Followers
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Eye className="h-3 w-3 mr-1" />
                {artistData.monthlyListeners.toLocaleString()} Monthly Listeners
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/30 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                Joined {new Date(artistData.joinDate).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                window.location.href = '/artist/upload';
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Track
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">{stat.change}</span>
                      <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white/5 border-purple-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tracks" className="data-[state=active]:bg-purple-600/30">
              Tracks
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600/30">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-purple-600/30">
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center">
                          {activity.type === 'stream' && <Play className="h-5 w-5 text-purple-400" />}
                          {activity.type === 'follower' && <Users className="h-5 w-5 text-blue-400" />}
                          {activity.type === 'payout' && <DollarSign className="h-5 w-5 text-green-400" />}
                          {activity.type === 'upload' && <Upload className="h-5 w-5 text-yellow-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.message}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Tracks */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performing Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tracks.slice(0, 3).map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-purple-600/30 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{track.title}</p>
                            <p className="text-xs text-gray-400">
                              {track.streams.toLocaleString()} streams
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-400">
                            ${track.revenue.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracks" className="space-y-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Your Tracks</CardTitle>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    window.location.href = '/artist/upload';
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Track
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded bg-purple-600/30 flex items-center justify-center">
                          <Music className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{track.title}</p>
                            {track.status === 'draft' && (
                              <Badge variant="secondary" className="bg-yellow-600/30 text-yellow-300 text-xs">
                                Draft
                              </Badge>
                            )}
                            {track.status === 'published' && (
                              <Badge variant="secondary" className="bg-green-600/30 text-green-300 text-xs">
                                Published
                              </Badge>
                            )}
                            {track.status === 'unpublished' && (
                              <Badge variant="secondary" className="bg-gray-600/30 text-gray-300 text-xs">
                                Unpublished
                              </Badge>
                            )}
                            {track.status === 'draft' && (
                              <Badge variant="secondary" className="bg-yellow-600/30 text-yellow-300 text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-gray-400">
                            <span>{track.streams.toLocaleString()} streams</span>
                            <span>{track.listeners.toLocaleString()} listeners</span>
                            {track.releaseDate && (
                              <span>
                                Released {new Date(track.releaseDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-medium text-green-400">${track.revenue.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">revenue</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Publish/Unpublish Toggle */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {track.status === 'published' ? 'Published' : track.status === 'unpublished' ? 'Unpublished' : 'Draft'}
                          </span>
                          {track.status !== 'draft' && (
                            <Switch
                              checked={track.status === 'published'}
                              onCheckedChange={() => toggleTrackStatus(track.id)}
                              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                            />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Streams Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <p>Chart visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Listener Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <p>Demographics chart coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            {/* Payout Rates Info Card */}
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-2 border-green-500/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Transparent Payout Rates</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      EmPulse pays artists 4-6x the industry average. No small print. No earnings curve. Real money, visible in real time.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Free Streams</p>
                        <p className="text-2xl font-bold text-white">$0.004</p>
                        <p className="text-xs text-gray-400 mt-1">per stream</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Premium Streams</p>
                        <p className="text-2xl font-bold text-white">$0.006</p>
                        <p className="text-xs text-gray-400 mt-1">per stream</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Total Earnings</p>
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ${artistData.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">This Month</p>
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ${artistData.thisMonthEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">January 2024</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Next Payout</p>
                    <Wallet className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">$0.00</p>
                  <p className="text-xs text-gray-500 mt-1">Feb 1, 2024</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Payout History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutHistory.map((payout, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {new Date(payout.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          Processed on {new Date(payout.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          ${payout.amount.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="bg-green-600/30 text-green-300 text-xs mt-1">
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
