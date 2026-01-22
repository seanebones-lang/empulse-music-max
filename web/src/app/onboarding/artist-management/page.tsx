'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  UserCog,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Music,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Shield,
  TrendingUp,
  Award,
  Mail,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 1,
    title: 'Welcome, Manager!',
    icon: UserCog,
    content: {
      heading: 'Manage Multiple Artists with Ease',
      description:
        'EmPulse offers powerful tools for artist managers and management companies to oversee multiple artists, track performance, and maximize earnings.',
      features: [
        {
          icon: Users,
          title: 'Multi-Artist Dashboard',
          description: 'Manage all your artists from one centralized dashboard. View stats, earnings, and performance across your entire roster.',
        },
        {
          icon: Building2,
          title: 'Company Accounts',
          description: 'Set up a management company account with custom pricing, bulk features, and dedicated support for your team.',
        },
        {
          icon: BarChart3,
          title: 'Advanced Analytics',
          description: 'Get detailed insights into each artist\'s performance, earnings, and growth trends. Make data-driven decisions.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Account Setup',
    icon: Building2,
    content: {
      heading: 'Setting Up Your Management Account',
      description:
        'Create a management company account to access bulk features, custom pricing, and tools designed for managing multiple artists.',
      features: [
        {
          icon: Shield,
          title: 'Company Verification',
          description: 'Verify your management company with business information, EIN, and company details for account setup.',
        },
        {
          icon: Users,
          title: 'Team Access',
          description: 'Invite team members with different permission levels. Control who can view, edit, or manage artist accounts.',
        },
        {
          icon: DollarSign,
          title: 'Custom Pricing',
          description: 'Discuss custom pricing options for bulk artist management, enterprise features, and dedicated support.',
        },
      ],
      tip: 'Management accounts receive priority support and custom features. Contact us to set up your company account.',
    },
  },
  {
    id: 3,
    title: 'Managing Artists',
    icon: Music,
    content: {
      heading: 'Artist Management Tools',
      description:
        'Use powerful tools to manage your artists\' music, track performance, and optimize their presence on EmPulse.',
      features: [
        {
          icon: Upload,
          title: 'Bulk Upload',
          description: 'Upload tracks for multiple artists efficiently. Set mood tags, metadata, and publish across your roster.',
        },
        {
          icon: BarChart3,
          title: 'Performance Tracking',
          description: 'Monitor each artist\'s streams, earnings, and listener growth. Compare performance and identify trends.',
        },
        {
          icon: TrendingUp,
          title: 'Optimization Tools',
          description: 'Analyze mood tags, release timing, and track performance to optimize each artist\'s strategy.',
        },
      ],
      tip: 'Use analytics to identify which artists and tracks perform best. Apply successful strategies across your roster.',
    },
  },
  {
    id: 4,
    title: 'Financial Management',
    icon: DollarSign,
    content: {
      heading: 'Earnings & Payouts',
      description:
        'Track earnings across all your artists, manage payout settings, and access detailed financial reports.',
      features: [
        {
          icon: BarChart3,
          title: 'Aggregated Earnings',
          description: 'View total earnings across all your artists in one place. Track revenue by artist, track, or time period.',
        },
        {
          icon: DollarSign,
          title: 'Payout Management',
          description: 'Configure payout settings for each artist or set company-wide defaults. Manage payment schedules and thresholds.',
        },
        {
          icon: Award,
          title: 'Financial Reports',
          description: 'Generate detailed financial reports for accounting, tax purposes, or client presentations. Export data anytime.',
        },
      ],
      tip: 'Set up automated reports to receive regular earnings summaries. Perfect for client updates and financial planning.',
    },
  },
  {
    id: 5,
    title: 'Support & Resources',
    icon: Shield,
    content: {
      heading: 'Dedicated Support',
      description:
        'Management accounts receive priority support, exclusive resources, and access to specialized features.',
      features: [
        {
          icon: Mail,
          title: 'Priority Support',
          description: 'Get faster response times and dedicated support channels. Your questions and issues are prioritized.',
        },
        {
          icon: Users,
          title: 'Account Manager',
          description: 'Work with a dedicated account manager who understands your needs and can help optimize your artists\' success.',
        },
        {
          icon: Award,
          title: 'Exclusive Features',
          description: 'Access to beta features, early releases, and tools designed specifically for management companies.',
        },
      ],
      tip: 'Join our management community to connect with other managers, share strategies, and stay updated on platform developments.',
    },
  },
  {
    id: 6,
    title: 'Get Started',
    icon: CheckCircle2,
    content: {
      heading: 'Ready to Set Up Your Account?',
      description: 'Here\'s how to get started as a management company on EmPulse:',
      features: [
        {
          icon: Mail,
          title: 'Contact Us',
          description: 'Reach out to discuss your management company needs, custom pricing, and account setup requirements.',
        },
        {
          icon: Building2,
          title: 'Account Setup',
          description: 'Complete the management company signup with business information, team details, and artist roster.',
        },
        {
          icon: Users,
          title: 'Add Artists',
          description: 'Link your artists\' accounts or help them sign up. Start managing their music and tracking performance.',
        },
        {
          icon: BarChart3,
          title: 'Start Managing',
          description: 'Use the dashboard to upload music, track performance, and optimize your artists\' presence on EmPulse.',
        },
      ],
      tip: 'Contact michellellvnw@gmail.com to discuss management account setup, custom pricing, and dedicated support options.',
    },
  },
];

export default function ArtistManagementOnboardingPage() {
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
    window.location.href = 'mailto:michellellvnw@gmail.com?subject=Management Company Account Inquiry';
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
              <UserCog className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Artist Management Onboarding</h1>
            </div>
            <p className="text-gray-400">Learn how to manage artists on EmPulse</p>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
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
                              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center shrink-0">
                                <FeatureIcon className="h-5 w-5 text-blue-400" />
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
