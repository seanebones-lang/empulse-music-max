'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Sparkles,
  Heart,
  Filter,
  X,
  RefreshCw,
  Settings,
  BookOpen,
  TrendingUp,
  Smile,
  Zap,
  Wind,
  Flame,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

const affirmationCategories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'motivation', label: 'Motivation', icon: TrendingUp },
  { id: 'self-love', label: 'Self-Love', icon: Heart },
  { id: 'calm', label: 'Calm', icon: Wind },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'gratitude', label: 'Gratitude', icon: Smile },
];

const mockAffirmations = [
  {
    id: '1',
    text: 'I am capable of handling whatever comes my way today.',
    category: 'motivation',
    moodTags: ['motivated', 'excited'],
    usageCount: 5,
  },
  {
    id: '2',
    text: 'I choose to see the good in every situation.',
    category: 'gratitude',
    moodTags: ['grateful', 'peaceful'],
    usageCount: 8,
  },
  {
    id: '3',
    text: 'I am worthy of love and respect, especially from myself.',
    category: 'self-love',
    moodTags: ['calm', 'peaceful'],
    usageCount: 12,
  },
  {
    id: '4',
    text: 'I breathe in calm and breathe out tension.',
    category: 'calm',
    moodTags: ['anxious', 'stressed', 'calm'],
    usageCount: 15,
  },
  {
    id: '5',
    text: 'I have the energy I need to accomplish my goals today.',
    category: 'energy',
    moodTags: ['tired', 'motivated'],
    usageCount: 7,
  },
  {
    id: '6',
    text: 'Every challenge is an opportunity for growth.',
    category: 'motivation',
    moodTags: ['stressed', 'motivated'],
    usageCount: 6,
  },
  {
    id: '7',
    text: 'I am grateful for the small moments of joy in my day.',
    category: 'gratitude',
    moodTags: ['grateful', 'happy'],
    usageCount: 10,
  },
  {
    id: '8',
    text: 'I trust myself to make the right decisions.',
    category: 'self-love',
    moodTags: ['anxious', 'calm'],
    usageCount: 9,
  },
  {
    id: '9',
    text: 'I am at peace with who I am and where I am in life.',
    category: 'calm',
    moodTags: ['peaceful', 'calm'],
    usageCount: 11,
  },
  {
    id: '10',
    text: 'My body and mind are strong and resilient.',
    category: 'energy',
    moodTags: ['tired', 'motivated'],
    usageCount: 4,
  },
];

export default function AffirmationsPage() {
  const { sidebarWidth, isSidebarCollapsed, mood } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAffirmation, setSelectedAffirmation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [affirmationsEnabled, setAffirmationsEnabled] = useState(true);
  const [dailyAffirmation, setDailyAffirmation] = useState(mockAffirmations[0]);

  // Get mood-based affirmations
  const getMoodBasedAffirmations = () => {
    // Determine user's current mood state
    const isLowEnergy = mood.energy < 40;
    const isLowHappiness = mood.happiness < 40;
    const isAnxious = mood.calmness < 40;
    const isHighIntensity = mood.intensity > 70;

    // Filter affirmations based on mood
    return mockAffirmations.filter((affirmation) => {
      if (isLowEnergy) {
        return affirmation.category === 'energy' || affirmation.moodTags.includes('tired');
      }
      if (isLowHappiness) {
        return affirmation.category === 'self-love' || affirmation.category === 'gratitude';
      }
      if (isAnxious) {
        return affirmation.category === 'calm' || affirmation.moodTags.includes('anxious') || affirmation.moodTags.includes('stressed');
      }
      if (isHighIntensity) {
        return affirmation.category === 'calm' || affirmation.moodTags.includes('peaceful');
      }
      return true;
    });
  };

  const getFilteredAffirmations = () => {
    const moodBased = getMoodBasedAffirmations();
    if (selectedCategory === 'all') {
      return moodBased;
    }
    return moodBased.filter((aff) => aff.category === selectedCategory);
  };

  const handleAffirmationClick = (affirmationId: string) => {
    const affirmation = mockAffirmations.find((a) => a.id === affirmationId);
    if (affirmation) {
      setDailyAffirmation(affirmation);
      setIsModalOpen(true);
      // TODO: Track usage in backend
    }
  };

  const getRandomAffirmation = () => {
    const filtered = getFilteredAffirmations();
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setDailyAffirmation(random);
      setIsModalOpen(true);
    }
  };

  const filteredAffirmations = getFilteredAffirmations();

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-10 w-10 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">Affirmations</h1>
            </div>
            <p className="text-lg text-gray-400">
              Daily mood-based affirmations to support your wellbeing
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">Enabled</span>
              <Switch
                checked={affirmationsEnabled}
                onCheckedChange={setAffirmationsEnabled}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Daily Affirmation Card */}
        {affirmationsEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Today&apos;s Affirmation</h2>
                    <p className="text-xl text-gray-200 italic mb-4">
                      &quot;{dailyAffirmation.text}&quot;
                    </p>
                    <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/30 capitalize">
                      {dailyAffirmation.category}
                    </Badge>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={getRandomAffirmation}
                      variant="outline"
                      className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      New Affirmation
                    </Button>
                    <Button
                      onClick={() => handleAffirmationClick(dailyAffirmation.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-400 shrink-0" />
          {affirmationCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  isSelected
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'border-purple-500/30 bg-white/5 text-white hover:bg-white/10'
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Affirmations Grid */}
        {affirmationsEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAffirmations.length > 0 ? (
              filteredAffirmations.map((affirmation, index) => (
                <motion.div
                  key={affirmation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer h-full"
                    onClick={() => handleAffirmationClick(affirmation.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/30 capitalize text-xs">
                            {affirmation.category}
                          </Badge>
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                        </div>
                        <p className="text-gray-200 italic text-sm leading-relaxed">
                          &quot;{affirmation.text}&quot;
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-purple-500/30">
                          <div className="flex flex-wrap gap-1">
                            {affirmation.moodTags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-white/5 text-gray-400 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            Used {affirmation.usageCount}x
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 col-span-full">
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No affirmations found for this category</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-12 text-center">
              <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Affirmations are currently disabled</p>
              <p className="text-sm text-gray-500">
                Enable affirmations above to see daily affirmations and browse the collection
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Heart className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How Affirmations Work</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Affirmations are personalized based on your current mood settings. The system
                  automatically suggests affirmations that match how you&apos;re feeling, helping
                  you find the right words when you need them most.
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Affirmations are filtered based on your mood check-in data</li>
                  <li>You can browse by category or get a random affirmation</li>
                  <li>Usage is tracked to help you discover your favorites</li>
                  <li>You can opt out at any time in settings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Daily Affirmation
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Take a moment to reflect on this affirmation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center mb-6">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <p className="text-2xl text-white italic leading-relaxed mb-4">
                &quot;{dailyAffirmation.text}&quot;
              </p>
              <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/30 capitalize">
                {dailyAffirmation.category}
              </Badge>
            </div>

            <div className="space-y-4 pt-4 border-t border-purple-500/30">
              <div>
                <p className="text-sm text-gray-400 mb-2">Mood Tags</p>
                <div className="flex flex-wrap gap-2">
                  {dailyAffirmation.moodTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/5 text-gray-300 border-gray-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Times used</span>
                <span className="text-white font-semibold">{dailyAffirmation.usageCount}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={getRandomAffirmation}
                variant="outline"
                className="flex-1 border-purple-500/30 bg-white/5 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Another One
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
