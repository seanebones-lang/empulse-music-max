'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentCard as ContentCardType } from '@/types/content';
import {
  Play,
  Music,
  Users,
  Disc,
  Radio,
  Heart,
  Calendar,
  Sparkles,
  ShoppingBag,
  Gift,
  MessageSquare,
  MessageCircle,
  UserPlus,
  Mail,
  Share2,
  List,
  Search,
  Award,
  Bell,
  Settings,
  Headphones,
  TrendingUp,
  BarChart3,
  Clock,
  BookOpen,
  Zap,
  Shield,
  Mic,
  Video,
  Radio as RadioIcon,
} from 'lucide-react';

interface ContentCardProps {
  card: ContentCardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
};

// Map card IDs to specific icons
const featureIconMap: Record<string, any> = {
  'feature-daily-mood-checkin': Heart,
  'feature-mood-journal': Calendar,
  'feature-affirmations': Sparkles,
  'feature-merch-store': ShoppingBag,
  'feature-points-redemption': Gift,
  'feature-moderated-comments': MessageSquare,
  'feature-anonymous-chat': MessageCircle,
  'feature-follow-artists': UserPlus,
  'feature-artist-messaging': Mail,
  'feature-playlist-sharing': Share2,
  'feature-queue-management': List,
  'feature-search': Search,
  'feature-badge-system': Award,
  'feature-email-notifications': Bell,
  'feature-mood-theming': Settings,
  'feature-voice-control': Mic,
  'feature-live-streaming': Video,
  'feature-podcast-platform': RadioIcon,
  'feature-mobile-apps': Headphones,
  'feature-artist-stations': Radio,
  'feature-wellness-integrations': TrendingUp,
  'feature-artist-payout': BarChart3,
  'feature-livlive-pages': Video,
  'feature-specialized-categories': Radio,
  'feature-onboarding': BookOpen,
  'founder-artists': Users,
  'founder-investors': TrendingUp,
  'founder-sponsors': Gift,
  'founder-listeners': Headphones,
};

const iconMap = {
  genre: Radio,
  feature: Music,
  artist: Users,
  playlist: Music,
  album: Disc,
  track: Play,
};

// Get the appropriate icon for a card
const getCardIcon = (card: ContentCardType) => {
  // Check if it's a specific feature with a mapped icon
  if (card.type === 'feature' && card.id && featureIconMap[card.id]) {
    return featureIconMap[card.id];
  }
  // Fall back to type-based icon
  return iconMap[card.type] || Music;
};

export function ContentCard({
  card,
  onClick,
  size = 'md',
}: ContentCardProps) {
  const Icon = getCardIcon(card);
  const cardSize = sizeClasses[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-colors overflow-hidden">
        <CardContent className="p-0">
          <div className={`relative ${cardSize} overflow-hidden`}>
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
            {/* Icon overlay - always visible with gradient background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shadow-lg">
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>
            {/* Hover effect - brighter icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/95 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl scale-110 transition-transform">
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-semibold line-clamp-1 text-white text-sm">
              {card.title}
            </h3>
            {card.subtitle && (
              <p className="text-xs text-gray-400 line-clamp-1">
                {card.subtitle}
              </p>
            )}
            {card.metadata?.trackCount && (
              <p className="text-xs text-gray-500">
                {card.metadata.trackCount} tracks
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
