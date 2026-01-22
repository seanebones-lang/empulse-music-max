'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Code,
  Api,
  Database,
  Webhook,
  FileCode,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Key,
  Server,
  GitBranch,
  BookOpen,
  Terminal,
  Music,
  BarChart3,
  Heart,
  Mail,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 1,
    title: 'Welcome, Developer!',
    icon: Code,
    content: {
      heading: 'Build with EmPulse API',
      description:
        'EmPulse provides a comprehensive API for developers to integrate music streaming, mood data, and wellness features into their applications.',
      features: [
        {
          icon: Api,
          title: 'RESTful API',
          description: 'Access tracks, artists, playlists, and user data through our well-documented REST API with standard authentication.',
        },
        {
          icon: Database,
          title: 'Real-Time Data',
          description: 'Get real-time updates on streams, earnings, and user activity. Webhooks available for event-driven integrations.',
        },
        {
          icon: Code,
          title: 'Developer Tools',
          description: 'SDKs, code examples, and comprehensive documentation to help you build quickly and efficiently.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'API Overview',
    icon: Api,
    content: {
      heading: 'What You Can Build',
      description:
        'Use the EmPulse API to create integrations, analytics tools, or custom applications that leverage our music and wellness data.',
      features: [
        {
          icon: Music,
          title: 'Music Data',
          description: 'Access track metadata, artist information, playlists, and streaming data. Search and filter by mood, genre, or popularity.',
        },
        {
          icon: BarChart3,
          title: 'Analytics',
          description: 'Retrieve streaming statistics, earnings data, listener demographics, and performance metrics for artists and tracks.',
        },
        {
          icon: Heart,
          title: 'Wellness Data',
          description: 'Access anonymized mood data, wellness trends, and aggregated statistics (with proper permissions and privacy compliance).',
        },
      ],
      tip: 'All API access requires authentication and approval. Contact us to get API credentials and discuss your use case.',
    },
  },
  {
    id: 3,
    title: 'Getting API Access',
    icon: Key,
    content: {
      heading: 'Request API Credentials',
      description:
        'To get started with the EmPulse API, you\'ll need to request access, describe your use case, and receive API credentials.',
      features: [
        {
          icon: Mail,
          title: 'Contact Us',
          description: 'Reach out with your project details, use case, and what you plan to build. We\'ll review and approve API access.',
        },
        {
          icon: Key,
          title: 'Get Credentials',
          description: 'Receive API keys, authentication tokens, and access credentials. We\'ll set up rate limits and permissions.',
        },
        {
          icon: BookOpen,
          title: 'Access Documentation',
          description: 'Get access to comprehensive API documentation, code examples, SDKs, and developer resources.',
        },
      ],
      tip: 'API access is currently in beta. We\'re working with select developers to refine the API before public release.',
    },
  },
  {
    id: 4,
    title: 'API Features',
    icon: Server,
    content: {
      heading: 'Available Endpoints',
      description:
        'The EmPulse API provides endpoints for music data, analytics, user management, and more. Here\'s what\'s available:',
      features: [
        {
          icon: Music,
          title: 'Music Endpoints',
          description: 'GET tracks, artists, playlists. Search by mood, genre, or metadata. Retrieve artwork, audio URLs, and metadata.',
        },
        {
          icon: BarChart3,
          title: 'Analytics Endpoints',
          description: 'Access streaming stats, earnings data, listener metrics, and performance analytics for artists and tracks.',
        },
        {
          icon: Webhook,
          title: 'Webhooks',
          description: 'Subscribe to events like new releases, stream milestones, or payout notifications. Real-time updates for your app.',
        },
      ],
      tip: 'Rate limits and authentication requirements vary by endpoint. Check documentation for specific details.',
    },
  },
  {
    id: 5,
    title: 'Development Resources',
    icon: BookOpen,
    content: {
      heading: 'Developer Resources',
      description:
        'Access comprehensive documentation, code examples, SDKs, and support to help you build with the EmPulse API.',
      features: [
        {
          icon: FileCode,
          title: 'Documentation',
          description: 'Comprehensive API documentation with endpoint details, request/response examples, error codes, and best practices.',
        },
        {
          icon: Code,
          title: 'Code Examples',
          description: 'Sample code in multiple languages (JavaScript, Python, etc.) to help you get started quickly.',
        },
        {
          icon: GitBranch,
          title: 'SDKs & Libraries',
          description: 'Official SDKs and community libraries to simplify API integration in your preferred language or framework.',
        },
      ],
      tip: 'Join our developer community to get support, share projects, and stay updated on API changes and new features.',
    },
  },
  {
    id: 6,
    title: 'Get Started',
    icon: CheckCircle2,
    content: {
      heading: 'Ready to Build?',
      description: 'Here\'s how to get started developing with the EmPulse API:',
      features: [
        {
          icon: Mail,
          title: 'Request Access',
          description: 'Contact us with your project details, use case, and what you plan to build. We\'ll review and approve access.',
        },
        {
          icon: Key,
          title: 'Get Credentials',
          description: 'Receive API keys and authentication tokens. Set up your development environment with the provided credentials.',
        },
        {
          icon: BookOpen,
          title: 'Read Documentation',
          description: 'Review the API documentation, explore endpoints, and check out code examples to understand how to integrate.',
        },
        {
          icon: Terminal,
          title: 'Start Building',
          description: 'Make your first API call, test endpoints, and start building your integration or application.',
        },
      ],
      tip: 'Contact michellellvnw@gmail.com with "API Access Request" in the subject line to get started.',
    },
  },
];

export default function DeveloperOnboardingPage() {
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
    window.location.href = 'mailto:michellellvnw@gmail.com?subject=API Access Request';
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
              <Code className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl font-bold text-white">Developer Onboarding</h1>
            </div>
            <p className="text-gray-400">Learn how to build with the EmPulse API</p>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
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
                              <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center shrink-0">
                                <FeatureIcon className="h-5 w-5 text-green-400" />
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Request API Access
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
