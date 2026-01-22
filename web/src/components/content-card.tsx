'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentCard as ContentCardType } from '@/types/content';
import { Play, Music, Users, Disc, Radio } from 'lucide-react';

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

const iconMap = {
  genre: Radio,
  feature: Music,
  artist: Users,
  playlist: Music,
  album: Disc,
  track: Play,
};

export function ContentCard({
  card,
  onClick,
  size = 'md',
}: ContentCardProps) {
  const Icon = iconMap[card.type] || Music;
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
            {/* Overlay with icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-600/80 flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="bg-black/60 text-white text-xs capitalize"
              >
                {card.type}
              </Badge>
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
