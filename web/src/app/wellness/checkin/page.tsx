'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  Zap,
  Smile,
  Wind,
  Flame,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

const moodTags = [
  { id: 'grateful', label: 'Grateful', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'anxious', label: 'Anxious', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 'excited', label: 'Excited', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { id: 'calm', label: 'Calm', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'tired', label: 'Tired', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { id: 'motivated', label: 'Motivated', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { id: 'stressed', label: 'Stressed', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'peaceful', label: 'Peaceful', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
];

export default function DailyMoodCheckInPage() {
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [mood, setMood] = useState({
    energy: 50,
    happiness: 50,
    calmness: 50,
    intensity: 50,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [journalNote, setJournalNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  // Mock user data
  const userStats = {
    currentStreak: 7,
    longestStreak: 12,
    totalPoints: 1250,
    hasCheckedInToday: false,
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else if (selectedTags.length < 8) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const calculatePoints = () => {
    let points = 10; // Base points for checking in
    if (selectedTags.length > 0) points += selectedTags.length * 2; // 2 points per tag
    if (journalNote.trim().length > 0) points += 5; // 5 points for journaling
    return points;
  };

  const handleSubmit = () => {
    const points = calculatePoints();
    setPointsEarned(points);
    setIsSubmitted(true);
    // TODO: Submit to backend API
    console.log('Mood check-in submitted:', {
      mood,
      tags: selectedTags,
      journalNote,
      points,
    });
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen p-8 pb-40 transition-all duration-200"
        style={{ marginLeft: `${sidebarOffset}px` }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Check-In Complete!</h1>
              <p className="text-xl text-gray-400">Great job taking care of yourself today</p>
            </div>
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                  <span className="text-3xl font-bold text-white">+{pointsEarned} Points</span>
                </div>
                <p className="text-gray-300">
                  You&apos;ve earned {pointsEarned} points for today&apos;s check-in!
                </p>
                {userStats.currentStreak > 0 && (
                  <div className="mt-4 pt-4 border-t border-purple-500/30">
                    <p className="text-sm text-gray-400">Current Streak</p>
                    <p className="text-2xl font-bold text-white">{userStats.currentStreak} days</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedTags([]);
                setJournalNote('');
                setMood({ energy: 50, happiness: 50, calmness: 50, intensity: 50 });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Check In Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

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
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-pink-400" />
            <h1 className="text-4xl font-bold text-white">Daily Mood Check-In</h1>
          </div>
          <p className="text-lg text-gray-400">
            Take a moment to reflect on how you&apos;re feeling today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{userStats.currentStreak}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Longest Streak</p>
                  <p className="text-2xl font-bold text-white">{userStats.longestStreak}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-white">{userStats.totalPoints}</p>
                  <p className="text-xs text-gray-500">earned</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Sliders */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="h-5 w-5" />
              How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Energy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <label className="text-sm font-medium text-gray-300">Energy</label>
                </div>
                <span className="text-sm text-white font-semibold">{mood.energy}</span>
              </div>
              <Slider
                value={[mood.energy]}
                onValueChange={([v]) => setMood({ ...mood, energy: v })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Happiness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="h-5 w-5 text-pink-400" />
                  <label className="text-sm font-medium text-gray-300">Happiness</label>
                </div>
                <span className="text-sm text-white font-semibold">{mood.happiness}</span>
              </div>
              <Slider
                value={[mood.happiness]}
                onValueChange={([v]) => setMood({ ...mood, happiness: v })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Sad</span>
                <span>Happy</span>
              </div>
            </div>

            {/* Calmness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-400" />
                  <label className="text-sm font-medium text-gray-300">Calmness</label>
                </div>
                <span className="text-sm text-white font-semibold">{mood.calmness}</span>
              </div>
              <Slider
                value={[mood.calmness]}
                onValueChange={([v]) => setMood({ ...mood, calmness: v })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Anxious</span>
                <span>Calm</span>
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <label className="text-sm font-medium text-gray-300">Intensity</label>
                </div>
                <span className="text-sm text-white font-semibold">{mood.intensity}</span>
              </div>
              <Slider
                value={[mood.intensity]}
                onValueChange={([v]) => setMood({ ...mood, intensity: v })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mild</span>
                <span>Intense</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags Selection */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Tags (up to 8)
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Choose tags that describe how you&apos;re feeling
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    disabled={!isSelected && selectedTags.length >= 8}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? tag.color + ' border-opacity-100 scale-105'
                        : 'bg-white/5 text-gray-400 border-gray-500/30 hover:border-gray-500/50 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-gray-400 mt-4">
                {selectedTags.length} of 8 tags selected (+{selectedTags.length * 2} points)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Journal Note */}
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Journal Note (Optional)
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Write about your day, thoughts, or anything you&apos;d like to remember (+5 points)
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="How are you feeling today? What's on your mind?"
              className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500 min-h-32 resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {journalNote.length > 0 && '+5 points for journaling'}
              </p>
              <p className="text-xs text-gray-500">{journalNote.length}/1000</p>
            </div>
          </CardContent>
        </Card>

        {/* Points Preview */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Points you&apos;ll earn</p>
                <p className="text-3xl font-bold text-white">+{calculatePoints()}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Base: 10 + Tags: {selectedTags.length * 2} + Journal: {journalNote.trim().length > 0 ? 5 : 0}
                </p>
              </div>
              <Sparkles className="h-12 w-12 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
            size="lg"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Submit Check-In
          </Button>
        </div>
      </div>
    </div>
  );
}
