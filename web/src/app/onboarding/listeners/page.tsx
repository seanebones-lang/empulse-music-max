'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Heart,
  Music,
  Sliders,
  Calendar,
  Sparkles,
  Gift,
  Share2,
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Headphones,
  TrendingUp,
  Award,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 1,
    title: 'Welcome to EmPulse',
    icon: Headphones,
    content: {
      heading: 'Music That Knows How You Feel',
      description:
        'EmPulse is a revolutionary music streaming platform that combines mood-based discovery, artist support, and mental wellness in one place.',
      features: [
        {
          icon: Sliders,
          title: 'Mood-Based Discovery',
          description: 'Discover music by how it makes you feel, not by popularity. Use two sliders to find exactly what matches your mood.',
        },
        {
          icon: Heart,
          title: 'Support Artists Directly',
          description: 'Artists earn 4-6x more per stream on EmPulse. Your listening directly supports independent creators.',
        },
        {
          icon: Sparkles,
          title: 'Wellness Built In',
          description: 'Track your mood, journal your thoughts, and receive daily affirmations—all integrated with your music experience.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Mood-Based Discovery',
    icon: Sliders,
    content: {
      heading: 'Two Sliders. Infinite Discovery.',
      description:
        'Forget searching by artist name or song title. Find music that matches exactly how you feel right now.',
      features: [
        {
          icon: Music,
          title: 'Mood Slider',
          description: 'Set your mood from sad to happy. Find music that matches your emotional state or helps shift you where you want to be.',
        },
        {
          icon: TrendingUp,
          title: 'Energy Slider',
          description: 'Set your energy from calm to energetic. Perfect for finding workout music, study focus, or relaxation tracks.',
        },
        {
          icon: Play,
          title: 'No Names Needed',
          description: 'Just set your sliders and let EmPulse find the perfect music. Unknown artists compete on equal footing with established acts.',
        },
      ],
      tip: 'Pro Tip: Adjust your sliders throughout the day as your mood changes. The music will adapt to match!',
    },
  },
  {
    id: 3,
    title: 'Wellness Features',
    icon: Heart,
    content: {
      heading: 'Mental Health Built In',
      description:
        'EmPulse isn\'t just a music app—it\'s a wellness platform that helps you understand and improve your mental health.',
      features: [
        {
          icon: Calendar,
          title: 'Daily Mood Check-In',
          description: 'Complete a quick daily check-in with mood sliders, tags, and optional journaling. Earn points for consistency!',
        },
        {
          icon: Sparkles,
          title: 'Affirmations',
          description: 'Receive mood-based affirmations personalized to how you\'re feeling. Browse by category or get a random one.',
        },
        {
          icon: TrendingUp,
          title: 'Track Your Progress',
          description: 'View your mood history, track streaks, and see patterns over time. Export your data anytime.',
        },
      ],
      tip: 'Building a daily check-in habit helps you understand your emotional patterns and improve your wellbeing.',
    },
  },
  {
    id: 4,
    title: 'Supporting Artists',
    icon: Gift,
    content: {
      heading: 'Real Money for Real Artists',
      description:
        'When you listen on EmPulse, artists earn significantly more than on other platforms. Your listening directly supports creators.',
      features: [
        {
          icon: TrendingUp,
          title: '4-6x Industry Average',
          description: 'Free streams pay $0.004. Premium streams pay $0.006. No small print, no earnings curve—just transparent payouts.',
        },
        {
          icon: Award,
          title: 'Real-Time Earnings',
          description: 'Artists see their earnings in real-time. No waiting months for opaque royalty statements.',
        },
        {
          icon: Share2,
          title: 'Discover New Artists',
          description: 'Mood-based discovery means you\'ll find amazing artists you\'ve never heard of. Support them from day one!',
        },
      ],
      tip: 'Premium subscribers help artists earn even more. Consider upgrading to support creators you love!',
    },
  },
  {
    id: 5,
    title: 'Getting Started',
    icon: CheckCircle2,
    content: {
      heading: 'Ready to Start Your Journey?',
      description: 'Here\'s how to make the most of your EmPulse experience:',
      features: [
        {
          icon: Sliders,
          title: 'Set Your Mood',
          description: 'Use the mood and energy sliders in the player to find music that matches how you feel.',
        },
        {
          icon: Calendar,
          title: 'Complete Daily Check-In',
          description: 'Visit the Wellness section to complete your daily mood check-in and start building your streak.',
        },
        {
          icon: Music,
          title: 'Explore & Discover',
          description: 'Browse genres, playlists, and featured content. Let mood-based discovery surprise you!',
        },
        {
          icon: Heart,
          title: 'Support Artists',
          description: 'Listen to independent artists and know that your streams are helping them earn a living.',
        },
      ],
      tip: 'Join our community! Follow artists, share playlists, and connect with other listeners who care about music and wellness.',
    },
  },
];

export default function ListenersOnboardingPage() {
  const router = useRouter();
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    // TODO: Mark onboarding as complete in backend
    router.push('/');
  };

  const handleSkip = () => {
    router.push('/');
  };

  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData.icon;

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Listener Onboarding</h1>
            </div>
            <p className="text-gray-400">Learn how to make the most of EmPulse</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-400 hover:text-white"
          >
            Skip Tutorial
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all ${
                step.id < currentStep
                  ? 'bg-green-500 w-8'
                  : step.id === currentStep
                    ? 'bg-purple-500 w-8'
                    : 'bg-gray-700 w-2'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{currentStepData.title}</CardTitle>
                    <p className="text-gray-400 mt-1">Step {currentStep} of {totalSteps}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {currentStepData.content.heading}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {currentStepData.content.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepData.content.features.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 border-purple-500/20 h-full">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center shrink-0">
                                <FeatureIcon className="h-5 w-5 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {currentStepData.content.tip && (
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-300 mb-1">Pro Tip</p>
                          <p className="text-sm text-gray-300">{currentStepData.content.tip}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-purple-500/30 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
