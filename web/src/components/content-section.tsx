'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard as ContentCardType, Section } from '@/types/content';
import { ContentCard as ContentCardComponent } from './content-card';

interface ContentSectionProps {
  section: Section;
  onCardClick?: (card: ContentCardType) => void;
}

export function ContentSection({ section, onCardClick }: ContentSectionProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
        {section.showAllLink && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            Show all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex gap-4 pb-4">
            {section.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0"
              >
                <ContentCardComponent
                  card={item}
                  onClick={() => onCardClick?.(item)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
