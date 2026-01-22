'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Crown,
  Music,
  Users,
  Building2,
  Mail,
  Sparkles,
  Zap,
  Shield,
  Headphones,
  Quote,
  Calendar,
  Rocket,
  Heart,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { usePlayer } from '@/store/player-store';

export default function PremiumPage() {
  const { sidebarWidth, isSidebarCollapsed } = usePlayer();
  const sidebarOffset = isSidebarCollapsed ? 64 : sidebarWidth;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'Perfect for casual listeners',
      icon: Headphones,
      color: 'from-gray-500 to-gray-600',
      borderColor: 'border-gray-500/30',
      features: [
        { text: 'Ad-supported streaming', included: true },
        { text: 'Access to all music', included: true },
        { text: 'Mood-based discovery (two sliders)', included: true },
        { text: 'Daily mood tracking', included: true },
        { text: 'Standard audio quality', included: true },
        { text: 'Ad-free experience', included: false },
        { text: 'Unlimited skips', included: false },
        { text: 'High-quality audio', included: false },
        { text: 'Offline downloads', included: false },
        { text: 'Journaling & affirmations', included: false },
        { text: 'Wellness streaks', included: false },
      ],
      cta: 'Current Plan',
      ctaVariant: 'outline' as const,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Best for music lovers',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/50',
      popular: true,
      features: [
        { text: 'Ad-free streaming', included: true },
        { text: 'Unlimited skips', included: true },
        { text: 'High-quality audio', included: true },
        { text: 'Mood-based discovery', included: true },
        { text: 'Daily mood tracking', included: true },
        { text: 'Journaling & affirmations', included: true },
        { text: 'Wellness streaks', included: true },
        { text: 'Premium streams pay artists $0.006', included: true },
      ],
      cta: 'Upgrade to Premium',
      ctaVariant: 'default' as const,
    },
    {
      id: 'artist',
      name: 'Artist Account',
      price: '$14.99',
      period: 'per month',
      description: 'For independent artists',
      icon: Music,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/50',
      features: [
        { text: 'All Premium features', included: true },
        { text: 'Upload unlimited tracks', included: true },
        { text: 'Real-time dashboard & analytics', included: true },
        { text: '$0.004 per free stream payout', included: true },
        { text: '$0.006 per premium stream payout', included: true },
        { text: '4-6x industry average earnings', included: true },
        { text: 'One-click unpublish control', included: true },
        { text: 'Transparent, real-time earnings', included: true },
      ],
      cta: 'Get Artist Account',
      ctaVariant: 'default' as const,
    },
  ];

  const handleSubscribe = (planId: string) => {
    // TODO: Implement subscription logic
    console.log('Subscribe to:', planId);
    if (planId === 'free') {
      return; // Already on free plan
    }
    alert(`Redirecting to checkout for ${planId}...`);
  };

  return (
    <div
      className="min-h-screen p-8 pb-40 transition-all duration-200"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover by mood, not algorithm. Support artists with real pay. Wellness built in, not bolted on.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`bg-white/5 backdrop-blur-sm border-2 ${plan.borderColor} hover:border-opacity-100 transition-all h-full flex flex-col ${
                    plan.popular ? 'scale-105 shadow-2xl' : ''
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-400 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included ? 'text-white' : 'text-gray-500 line-through'
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      variant={plan.ctaVariant}
                      className={`w-full ${
                        plan.ctaVariant === 'default'
                          ? 'bg-gradient-to-r ' + plan.color + ' hover:opacity-90 text-white'
                          : 'border-gray-500/30 text-white hover:bg-white/10'
                      }`}
                      disabled={plan.id === 'free'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Management/Label Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-indigo-500/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Management / Label Accounts
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Need a custom plan for your management company or record label? We offer
                    enterprise solutions with bulk pricing, dedicated support, and custom features.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Custom Pricing
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      <Users className="h-3 w-3 mr-1" />
                      Multi-Artist Support
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Priority Support
                    </Badge>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    <a href="mailto:michellellvnw@gmail.com?subject=Management/Label Account Inquiry">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-gray-400">
                  Yes, you can cancel your subscription at any time. Your premium features will
                  remain active until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-gray-400">
                  We accept all major credit cards, debit cards, and PayPal. All payments are
                  processed securely through Stripe.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Do you offer student discounts?</h3>
                <p className="text-sm text-gray-400">
                  Yes! Students with valid .edu email addresses can get 50% off Premium plans.
                  Contact us for verification.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">What's included in Artist Account?</h3>
                <p className="text-sm text-gray-400">
                  Artist accounts include all Premium features plus unlimited track uploads, real-time
                  analytics, and transparent payouts: $0.004 per free stream and $0.006 per premium stream (4-6x industry average).
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Join the Movement
          </h2>
          <p className="text-center text-gray-400 mb-8">
            See what artists and listeners are saying about EmPulse
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-400 mb-4" />
                <p className="text-white mb-4 italic">
                  &quot;I&apos;ve made $47 in my first month on EmPulse. That&apos;s more than Spotify paid me in 6 months with 10x the streams.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold">SC</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Chen</p>
                    <p className="text-sm text-gray-400">Independent Artist • Chicago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-400 mb-4" />
                <p className="text-white mb-4 italic">
                  &quot;The mood slider changed how I discover music. I found three new favorite artists this week that I never would have found on Spotify.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">MJ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Marcus Johnson</p>
                    <p className="text-sm text-gray-400">Music Lover • Austin</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-400 mb-4" />
                <p className="text-white mb-4 italic">
                  &quot;Finally, a platform that treats artists like partners, not products. The real-time dashboard is a game-changer.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold">TME</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">The Midnight Echoes</p>
                    <p className="text-sm text-gray-400">Indie Band • Portland</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-purple-400 mb-4" />
                <p className="text-white mb-4 italic">
                  &quot;I love that I can track my mood and discover music that actually matches how I&apos;m feeling. It&apos;s like therapy through music.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold">ER</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Emma Rodriguez</p>
                    <p className="text-sm text-gray-400">Beta Tester • New York</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Roadmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Where We&apos;re Headed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-green-500 text-white">NOW</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Q1 2026</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Mood-based streaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Artist uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Wellness tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Beta live</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-blue-500 text-white">Q2 2026</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Q2 2026</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Venue partnerships for live streaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Expanded artist tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Growth marketing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-indigo-500 text-white">Q3 2026</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Q3 2026</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Artist self-streaming from profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Podcast platform integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-pink-500 text-white">Q4 2026</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Q4 2026</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>Mobile apps (iOS/Android)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>Dedicated artist stations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>Expanded wellness integrations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Key Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Discover by Feeling. Support Artists. Feel Better.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Two sliders. Infinite discovery.</h3>
                  <p className="text-sm text-gray-300">
                    Set your mood. Set your energy. Find music that matches exactly where you are—or shifts you where you want to go. No names needed. Just feelings.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">$0.004 to $0.006 per stream.</h3>
                  <p className="text-sm text-gray-300">
                    Free streams pay $0.004. Premium streams pay $0.006. No small print. No earnings curve. Real money for real artists, visible in real time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Mental health built in.</h3>
                  <p className="text-sm text-gray-300">
                    Daily mood tracking. Journaling. Affirmations. Streaks that reward consistency. Music and wellness in one place, reinforcing each other.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
