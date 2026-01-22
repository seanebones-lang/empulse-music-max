'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  DollarSign,
  Upload,
  BarChart3,
  Music,
  ShoppingBag,
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Users,
  Award,
  Sparkles,
  Calendar,
  Sliders,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 1,
    title: 'Welcome, Artist!',
    icon: Mic,
    content: {
      heading: 'Earn 4-6x More Per Stream',
      description:
        'EmPulse is built for independent artists. We offer transparent payouts, real-time analytics, and tools to help you succeed.',
      features: [
        {
          icon: DollarSign,
          title: 'Transparent Payouts',
          description: '$0.004 per free stream, $0.006 per premium stream. No small print, no earnings curve—just real money.',
        },
        {
          icon: TrendingUp,
          title: 'Real-Time Dashboard',
          description: 'See your earnings, streams, and listener stats update in real-time. No waiting months for statements.',
        },
        {
          icon: Music,
          title: 'Full Control',
          description: 'Upload unlimited tracks, set your own mood tags, and unpublish with one click. Your music, your rules.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Getting Paid',
    icon: Wallet,
    content: {
      heading: 'How Payouts Work',
      description:
        'EmPulse pays artists significantly more than other platforms. Here\'s everything you need to know about getting paid.',
      features: [
        {
          icon: DollarSign,
          title: 'Payout Rates',
          description: 'Free streams: $0.004 each. Premium streams: $0.006 each. That\'s 4-6x the industry average of $0.001 per stream.',
        },
        {
          icon: Calendar,
          title: 'Payout Schedule',
          description: 'Set your payout frequency (weekly, bi-weekly, or monthly) and minimum threshold. Payments processed via Stripe.',
        },
        {
          icon: BarChart3,
          title: 'Track Everything',
          description: 'See exactly how much you\'ve earned from each track, when payouts are processed, and your payment history.',
        },
      ],
      tip: 'Early Access: First 500 artists get a lifetime 10% bonus on all earnings!',
    },
  },
  {
    id: 3,
    title: 'Uploading Your Music',
    icon: Upload,
    content: {
      heading: 'Upload & Distribute',
      description:
        'Upload your tracks, set mood tags, and get your music discovered by listeners who match your vibe.',
      features: [
        {
          icon: Music,
          title: 'Unlimited Uploads',
          description: 'Upload as many tracks as you want. No limits, no extra fees. Perfect for artists with large catalogs.',
        },
        {
          icon: Sliders,
          title: 'Mood Tagging',
          description: 'Set mood sliders (energy, happiness, calmness, intensity) for each track. Accurate tags = better discovery.',
        },
        {
          icon: Share2,
          title: 'One-Click Control',
          description: 'Publish or unpublish tracks instantly. No waiting for approval or processing delays.',
        },
      ],
      tip: 'Accurate mood settings help listeners find your music when they need it most. Take time to set them correctly!',
    },
  },
  {
    id: 4,
    title: 'Analytics & Growth',
    icon: BarChart3,
    content: {
      heading: 'Understand Your Audience',
      description:
        'Real-time analytics help you understand who\'s listening, where they\'re from, and how your music is performing.',
      features: [
        {
          icon: TrendingUp,
          title: 'Real-Time Stats',
          description: 'See streams, listeners, and earnings update in real-time. No delays, no guesswork.',
        },
        {
          icon: Users,
          title: 'Listener Insights',
          description: 'Understand your audience demographics, listening patterns, and which tracks resonate most.',
        },
        {
          icon: Award,
          title: 'Track Performance',
          description: 'Compare track performance, identify trends, and see which mood tags drive the most discovery.',
        },
      ],
      tip: 'Use analytics to understand what works. Adjust your mood tags and release strategy based on data.',
    },
  },
  {
    id: 5,
    title: 'Additional Features',
    icon: Sparkles,
    content: {
      heading: 'More Ways to Earn',
      description:
        'EmPulse offers additional features to help you monetize your music and connect with fans.',
      features: [
        {
          icon: ShoppingBag,
          title: 'Merch Store',
          description: 'Sell merchandise directly through EmPulse. Beta artists get 100% revenue (pre-Sept 30, 2026).',
        },
        {
          icon: Share2,
          title: 'Fan Messaging',
          description: 'Connect directly with fans through in-app messaging. Build relationships and grow your community.',
        },
        {
          icon: Users,
          title: 'Profile Customization',
          description: 'Customize your artist profile with photos, bio, social links, and showcase your best tracks.',
        },
      ],
      tip: 'Beta artists get special perks! Make sure to acknowledge the beta perk during signup to unlock benefits.',
    },
  },
  {
    id: 6,
    title: 'Getting Started',
    icon: CheckCircle2,
    content: {
      heading: 'Ready to Upload?',
      description: 'Here\'s your action plan to get started on EmPulse:',
      features: [
        {
          icon: Upload,
          title: 'Complete Signup',
          description: 'Fill out the artist signup form with your profile info, payment details, and tax information.',
        },
        {
          icon: Music,
          title: 'Upload Your First Track',
          description: 'Upload a track, set accurate mood tags, add metadata, and publish. Start with your best work!',
        },
        {
          icon: Share2,
          title: 'Share Your Profile',
          description: 'Share your EmPulse profile on social media. Let fans know where to find you and support you directly.',
        },
        {
          icon: BarChart3,
          title: 'Monitor & Optimize',
          description: 'Check your dashboard regularly, analyze what works, and adjust your strategy based on real data.',
        },
      ],
      tip: 'Join our artist community! Connect with other independent artists, share tips, and grow together.',
    },
  },
];

export default function ArtistsOnboardingPage() {
  const router = useRouter();
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
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
    router.push('/artist/signup');
  };

  const handleSkip = () => {
    router.push('/artist/signup');
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
              <Mic className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Artist Onboarding</h1>
            </div>
            <p className="text-gray-400">Learn how to succeed on EmPulse</p>
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
              Start Artist Signup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
