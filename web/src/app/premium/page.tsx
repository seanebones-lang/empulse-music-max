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
        { text: 'Basic mood check-ins', included: true },
        { text: 'Limited skips per hour', included: true },
        { text: 'Standard audio quality', included: true },
        { text: 'Ad-free experience', included: false },
        { text: 'Unlimited skips', included: false },
        { text: 'High-quality audio', included: false },
        { text: 'Offline downloads', included: false },
        { text: 'Mood-based playlists', included: false },
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
        { text: 'High-quality audio (320kbps)', included: true },
        { text: 'Offline downloads', included: true },
        { text: 'Mood-based playlists', included: true },
        { text: 'Priority customer support', included: true },
        { text: 'Early access to new features', included: true },
        { text: 'Exclusive content', included: true },
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
        { text: 'Artist dashboard & analytics', included: true },
        { text: '$0.004 per stream payout', included: true },
        { text: 'Merch store integration', included: true },
        { text: 'Direct fan messaging', included: true },
        { text: 'Priority artist support', included: true },
        { text: 'Custom artist profile', included: true },
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
            Unlock the full potential of EmPulse with our premium plans. From casual listening to
            professional artist tools.
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
                    <a href="mailto:mdempulse2026@gmail.com?subject=Management/Label Account Inquiry">
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
                  Artist accounts include all Premium features plus unlimited track uploads, detailed
                  analytics, merch store integration, and $0.004 per stream payouts.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
