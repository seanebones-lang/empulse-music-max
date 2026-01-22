'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  TrendingUp,
  Users,
  Music,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  DollarSign,
  BarChart3,
  Gift,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 1,
    title: 'Welcome, Sponsor!',
    icon: Heart,
    content: {
      heading: 'Support the Wellness Music Revolution',
      description:
        'As a sponsor, you help independent artists thrive while supporting a platform that prioritizes mental wellness and fair pay.',
      features: [
        {
          icon: Music,
          title: 'Support Artists',
          description: 'Your sponsorship directly helps independent artists earn a living from their music. Every dollar makes a difference.',
        },
        {
          icon: TrendingUp,
          title: 'Platform Growth',
          description: 'Help EmPulse grow and reach more listeners and artists. Your support enables new features and better payouts.',
        },
        {
          icon: Heart,
          title: 'Wellness Mission',
          description: 'Support a platform that integrates mental wellness with music, helping people feel better through music discovery.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Sponsorship Benefits',
    icon: Award,
    content: {
      heading: 'What You Get',
      description:
        'Sponsors receive recognition, exclusive access, and the satisfaction of supporting independent artists and mental wellness.',
      features: [
        {
          icon: Users,
          title: 'Recognition',
          description: 'Your name or brand featured on the platform, in communications, and at events. Show your commitment to artists.',
        },
        {
          icon: Gift,
          title: 'Exclusive Access',
          description: 'Early access to new features, beta testing opportunities, and invitations to exclusive events and launches.',
        },
        {
          icon: BarChart3,
          title: 'Impact Reports',
          description: 'Regular reports showing how your sponsorship is helping artists and the platform grow. See your impact in numbers.',
        },
      ],
      tip: 'Sponsors at the founder level get lifetime recognition and special perks. Contact us to learn more!',
    },
  },
  {
    id: 3,
    title: 'How Sponsorship Works',
    icon: DollarSign,
    content: {
      heading: 'Support Options',
      description:
        'Choose a sponsorship level that fits your budget and goals. All sponsorships directly support artists and platform development.',
      features: [
        {
          icon: Heart,
          title: 'One-Time Donations',
          description: 'Make a one-time contribution to support artists and platform development. Any amount helps!',
        },
        {
          icon: TrendingUp,
          title: 'Monthly Sponsorships',
          description: 'Set up recurring monthly support. Consistent funding helps us plan features and support more artists.',
        },
        {
          icon: Award,
          title: 'Founder Sponsors',
          description: 'Join as a founder sponsor and receive lifetime recognition, exclusive perks, and early access to everything.',
        },
      ],
      tip: 'Founder sponsors (first 500) receive special recognition and lifetime benefits. Get in early!',
    },
  },
  {
    id: 4,
    title: 'Your Impact',
    icon: TrendingUp,
    content: {
      heading: 'Making a Difference',
      description:
        'Your sponsorship helps artists earn more, enables platform growth, and supports mental wellness initiatives.',
      features: [
        {
          icon: Music,
          title: 'Artist Support',
          description: 'Your funds help increase artist payouts, fund promotional opportunities, and support independent creators.',
        },
        {
          icon: Users,
          title: 'Platform Development',
          description: 'Sponsorship enables new features, better infrastructure, and faster growth to reach more listeners.',
        },
        {
          icon: Heart,
          title: 'Wellness Programs',
          description: 'Support mental wellness features, mood tracking tools, and initiatives that help listeners feel better.',
        },
      ],
      tip: 'Every sponsorship, no matter the size, directly helps artists and listeners. Thank you for your support!',
    },
  },
  {
    id: 5,
    title: 'Get Started',
    icon: CheckCircle2,
    content: {
      heading: 'Ready to Sponsor?',
      description: 'Here\'s how to become a sponsor and start making an impact:',
      features: [
        {
          icon: Heart,
          title: 'Contact Us',
          description: 'Reach out to discuss sponsorship options, levels, and how we can recognize your contribution.',
        },
        {
          icon: DollarSign,
          title: 'Choose Your Level',
          description: 'Select a sponsorship level that fits your goals. We offer flexible options for individuals and businesses.',
        },
        {
          icon: Award,
          title: 'Get Recognized',
          description: 'Receive recognition on the platform, in communications, and at events. Show your commitment publicly.',
        },
        {
          icon: BarChart3,
          title: 'Track Impact',
          description: 'Receive regular reports on how your sponsorship is helping artists and the platform grow.',
        },
      ],
      tip: 'Contact michellellvnw@gmail.com to discuss sponsorship opportunities and learn about founder sponsor benefits.',
    },
  },
];

export default function SponsorsOnboardingPage() {
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
    window.location.href = 'mailto:michellellvnw@gmail.com?subject=Sponsorship Inquiry';
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
              <Heart className="h-8 w-8 text-pink-400" />
              <h1 className="text-3xl font-bold text-white">Sponsor Onboarding</h1>
            </div>
            <p className="text-gray-400">Learn how to support EmPulse and artists</p>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
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
                              <div className="w-10 h-10 rounded-lg bg-pink-600/30 flex items-center justify-center shrink-0">
                                <FeatureIcon className="h-5 w-5 text-pink-400" />
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
                          <p className="text-sm font-semibold text-blue-300 mb-1">Important Note</p>
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
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
